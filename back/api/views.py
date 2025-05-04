from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.contrib.auth import get_user_model
from django.db.models import Q, Count
from datetime import date
from .models import (
    Therapist,
    Appointment,
    Review,
    Resource,
    Event,
    EventRegistration,
    ReadingList,
    Category,
    Notification,
    Message,
    UserProgress,
    AdminStats,
)
from .serializers import (
    UserSerializer,
    TherapistSerializer,
    AppointmentSerializer,
    ReviewSerializer,
    ResourceSerializer,
    EventSerializer,
    EventRegistrationSerializer,
    ReadingListSerializer,
    CategorySerializer,
    NotificationSerializer,
    MessageSerializer,
    UserProgressSerializer,
    AdminStatsSerializer,
)

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint for users
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["username", "email"]

    # def get_permissions(self):
    #     if self.action in ['create']:
    #         permission_classes = [AllowAny]
    #     elif self.action in ['list', 'retrieve']:
    #         permission_classes = [IsAuthenticated]
    #     else:
    #         permission_classes = [IsAuthenticated]
    #     return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = User.objects.all()
        role = self.request.query_params.get("role", None)
        if role:
            queryset = queryset.filter(role=role)
        return queryset

    @action(detail=False, methods=["get"])
    def me(self, request):
        serializer = self.serializer_class(request.user)
        return Response(serializer.data)


class TherapistViewSet(viewsets.ModelViewSet):
    """
    API endpoint for therapists
    """

    queryset = Therapist.objects.all()
    serializer_class = TherapistSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["user__username", "specialty", "specializations"]

    # def get_permissions(self):
    #     if self.action in ['list', 'retrieve']:
    #         permission_classes = [AllowAny]
    #     else:
    #         permission_classes = [IsAuthenticated]
    #     return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = Therapist.objects.all()

        # Filter by availability
        availability = self.request.query_params.get("availability", None)
        if availability == "true":
            queryset = queryset.filter(availability=True)

        # Filter by specialty
        specialty = self.request.query_params.get("specialty", None)
        if specialty:
            queryset = queryset.filter(specialty__icontains=specialty)

        # Filter by languages
        language = self.request.query_params.get("language", None)
        if language:
            queryset = queryset.filter(languages__contains=[language])

        # Filter by price range
        min_price = self.request.query_params.get("min_price", None)
        max_price = self.request.query_params.get("max_price", None)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        # Filter by rating
        min_rating = self.request.query_params.get("min_rating", None)
        if min_rating:
            queryset = queryset.filter(rating__gte=min_rating)

        return queryset

    @action(detail=True, methods=["get"])
    def reviews(self, request, pk=None):
        therapist = self.get_object()
        reviews = Review.objects.filter(therapist=therapist)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def appointments(self, request, pk=None):
        therapist = self.get_object()
        appointments = Appointment.objects.filter(therapist=therapist)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def availability(self, request, pk=None):
        therapist = self.get_object()
        schedule = {}

        # Get all time slots for the therapist
        time_slots = therapist.time_slots.filter(is_available=True)

        # Group by day
        for slot in time_slots:
            if slot.day not in schedule:
                schedule[slot.day] = []
            schedule[slot.day].append(slot.time)

        return Response(schedule)


class AppointmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for appointments
    """

    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Admin can see all appointments
        if user.is_staff or user.role == "admin":
            queryset = Appointment.objects.all()
        # Therapist can see their appointments
        elif user.role == "therapist":
            queryset = Appointment.objects.filter(therapist__user=user)
        # User can see their appointments
        else:
            queryset = Appointment.objects.filter(user=user)

        # Filter by status
        status_param = self.request.query_params.get("status", None)
        if status_param:
            queryset = queryset.filter(status=status_param)

        # Filter by date
        date_param = self.request.query_params.get("date", None)
        if date_param:
            queryset = queryset.filter(date=date_param)

        # Filter by therapist
        therapist_id = self.request.query_params.get("therapist_id", None)
        if therapist_id:
            queryset = queryset.filter(therapist__id=therapist_id)

        # Filter by user
        user_id = self.request.query_params.get("user_id", None)
        if user_id and (
            user.is_staff
            or user.role == "admin"
            or (
                user.role == "therapist"
                and Appointment.objects.filter(
                    therapist__user=user, user__id=user_id
                ).exists()
            )
        ):
            queryset = queryset.filter(user__id=user_id)

        return queryset

    @action(detail=True, methods=["patch"])
    def update_status(self, request, pk=None):
        appointment = self.get_object()
        new_status = request.data.get("status", None)

        if not new_status:
            return Response(
                {"error": "Status is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        appointment.status = new_status
        appointment.save()

        serializer = self.get_serializer(appointment)
        return Response(serializer.data)


class ReviewViewSet(viewsets.ModelViewSet):
    """
    API endpoint for reviews
    """

    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Review.objects.all()

        # Filter by therapist
        therapist_id = self.request.query_params.get("therapist_id", None)
        if therapist_id:
            queryset = queryset.filter(therapist__id=therapist_id)

        # Filter by user
        user_id = self.request.query_params.get("user_id", None)
        if user_id:
            queryset = queryset.filter(user__id=user_id)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ResourceViewSet(viewsets.ModelViewSet):
    """
    API endpoint for resources
    """

    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "description", "author", "tags"]

    # def get_permissions(self):
    #     if self.action in ['list', 'retrieve']:
    #         permission_classes = [AllowAny]
    #     else:
    #         permission_classes = [IsAuthenticated]
    #     return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = Resource.objects.all()

        # Filter by category
        category = self.request.query_params.get("category", None)
        if category:
            queryset = queryset.filter(category=category)

        # Filter by type
        resource_type = self.request.query_params.get("type", None)
        if resource_type:
            queryset = queryset.filter(type=resource_type)

        # Filter by featured
        featured = self.request.query_params.get("featured", None)
        if featured == "true":
            queryset = queryset.filter(featured=True)

        # Filter by tag
        tag = self.request.query_params.get("tag", None)
        if tag:
            queryset = queryset.filter(tags__contains=[tag])

        return queryset

    @action(detail=False, methods=["get"])
    def featured(self, request):
        featured_resources = Resource.objects.filter(featured=True)
        serializer = self.get_serializer(featured_resources, many=True)
        return Response(serializer.data)


class EventViewSet(viewsets.ModelViewSet):
    """
    API endpoint for events
    """

    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "description", "presenter", "location"]

    # def get_permissions(self):
    #     if self.action in ['list', 'retrieve']:
    #         permission_classes = [AllowAny]
    #     else:
    #         permission_classes = [IsAuthenticated]
    #     return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = Event.objects.all()

        # Filter by category
        category = self.request.query_params.get("category", None)
        if category:
            queryset = queryset.filter(category=category)

        # Filter by date (upcoming events)
        upcoming = self.request.query_params.get("upcoming", None)
        if upcoming == "true":
            queryset = queryset.filter(date__gte=date.today())

        # Filter by price (free events)
        free = self.request.query_params.get("free", None)
        if free == "true":
            queryset = queryset.filter(price=0)

        return queryset

    @action(detail=True, methods=["post"])
    def register(self, request, pk=None):
        event = self.get_object()
        user = request.user

        # Check if user is already registered
        if EventRegistration.objects.filter(event=event, user=user).exists():
            return Response(
                {"error": "You are already registered for this event"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if event is full
        if event.registrations.count() >= event.capacity:
            return Response(
                {"error": "This event is already full"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Register user for event
        registration = EventRegistration.objects.create(
            event=event,
            user=user,
            payment_status="Pending" if event.price > 0 else "Paid",
        )

        serializer = EventRegistrationSerializer(registration)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["delete"])
    def unregister(self, request, pk=None):
        event = self.get_object()
        user = request.user

        # Check if user is registered
        try:
            registration = EventRegistration.objects.get(event=event, user=user)
        except EventRegistration.DoesNotExist:
            return Response(
                {"error": "You are not registered for this event"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Unregister user
        registration.delete()

        return Response(
            {"message": "Successfully unregistered from event"},
            status=status.HTTP_200_OK,
        )


class ReadingListViewSet(viewsets.ModelViewSet):
    """
    API endpoint for reading lists
    """

    queryset = ReadingList.objects.all()
    serializer_class = ReadingListSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "description", "category"]

    # def get_permissions(self):
    #     if self.action in ['list', 'retrieve']:
    #         permission_classes = [AllowAny]
    #     else:
    #         permission_classes = [IsAdminUser]
    #     return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = ReadingList.objects.all()

        # Filter by category
        category = self.request.query_params.get("category", None)
        if category:
            queryset = queryset.filter(category=category)

        return queryset


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for categories
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    # def get_permissions(self):
    #     if self.action in ['list', 'retrieve']:
    #         permission_classes = [AllowAny]
    #     else:
    #         permission_classes = [IsAdminUser]
    #     return [permission() for permission in permission_classes]


class NotificationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for notifications
    """

    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Get notifications for user or their role or all users
        queryset = Notification.objects.filter(
            Q(user=user) | Q(role=user.role) | Q(role="all")
        )

        # Filter by read status
        read = self.request.query_params.get("read", None)
        if read is not None:
            read_bool = read.lower() == "true"
            queryset = queryset.filter(read=read_bool)

        return queryset

    @action(detail=True, methods=["patch"])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.read = True
        notification.save()

        serializer = self.get_serializer(notification)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def mark_all_as_read(self, request):
        user = request.user

        # Mark all user's notifications as read
        Notification.objects.filter(
            Q(user=user) | Q(role=user.role) | Q(role="all"), read=False
        ).update(read=True)

        return Response(
            {"message": "All notifications marked as read"}, status=status.HTTP_200_OK
        )


class MessageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for messages
    """

    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Get messages sent to or from the user
        queryset = Message.objects.filter(Q(sender=user) | Q(receiver=user))

        # Filter by conversation partner
        partner_id = self.request.query_params.get("partner_id", None)
        if partner_id:
            queryset = queryset.filter(
                Q(sender__id=partner_id, receiver=user)
                | Q(sender=user, receiver__id=partner_id)
            )

        # Filter by read status
        read = self.request.query_params.get("read", None)
        if read is not None:
            read_bool = read.lower() == "true"
            queryset = queryset.filter(read=read_bool)

        return queryset

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    @action(detail=True, methods=["patch"])
    def mark_as_read(self, request, pk=None):
        message = self.get_object()

        # Only the receiver can mark a message as read
        if message.receiver != request.user:
            return Response(
                {"error": "You do not have permission to mark this message as read"},
                status=status.HTTP_403_FORBIDDEN,
            )

        message.read = True
        message.save()

        serializer = self.get_serializer(message)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def conversations(self, request):
        user = request.user

        # Get all users that the current user has exchanged messages with
        conversation_partners = User.objects.filter(
            Q(sent_messages__receiver=user) | Q(received_messages__sender=user)
        ).distinct()

        # Get the latest message and unread count for each conversation
        conversations = []
        for partner in conversation_partners:
            latest_message = (
                Message.objects.filter(
                    Q(sender=user, receiver=partner) | Q(sender=partner, receiver=user)
                )
                .order_by("-timestamp")
                .first()
            )

            unread_count = Message.objects.filter(
                sender=partner, receiver=user, read=False
            ).count()

            conversations.append(
                {
                    "partner": UserSerializer(partner).data,
                    "latest_message": MessageSerializer(latest_message).data
                    if latest_message
                    else None,
                    "unread_count": unread_count,
                }
            )

        return Response(conversations)


class UserProgressViewSet(viewsets.ModelViewSet):
    """
    API endpoint for user progress
    """

    queryset = UserProgress.objects.all()
    serializer_class = UserProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Users can only see their own progress
        if user.role == "user":
            queryset = UserProgress.objects.filter(user=user)
        # Therapists can see progress of their clients
        elif user.role == "therapist":
            # Get users who have appointments with this therapist
            client_ids = (
                Appointment.objects.filter(therapist__user=user)
                .values_list("user_id", flat=True)
                .distinct()
            )

            queryset = UserProgress.objects.filter(user__id__in=client_ids)
        # Admins can see all progress records
        else:
            queryset = UserProgress.objects.all()

        # Filter by user
        user_id = self.request.query_params.get("user_id", None)
        if user_id:
            queryset = queryset.filter(user__id=user_id)

        # Filter by date range
        start_date = self.request.query_params.get("start_date", None)
        end_date = self.request.query_params.get("end_date", None)
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)

        return queryset

    def perform_create(self, serializer):
        # Users can only create progress for themselves
        if self.request.user.role == "user":
            serializer.save(user=self.request.user)
        else:
            serializer.save()


class AdminStatsViewSet(viewsets.ModelViewSet):
    """
    API endpoint for admin statistics
    """

    queryset = AdminStats.objects.all()
    serializer_class = AdminStatsSerializer
    # permission_classes = [IsAdminUser]

    @action(detail=False, methods=["get"])
    def dashboard(self, request):
        """
        Get statistics for the admin dashboard
        """
        # Get the latest stats or create if none exist
        today = date.today()
        try:
            stats = AdminStats.objects.get(date=today)
        except AdminStats.DoesNotExist:
            # Calculate current statistics
            stats = AdminStats(date=today)
            stats.total_therapists = Therapist.objects.count()
            stats.active_users = User.objects.filter(role="user").count()
            stats.appointments_today = Appointment.objects.filter(
                date=today.strftime("%Y-%m-%d")
            ).count()
            stats.total_resources = Resource.objects.count()

            # User growth (simplified - actual calculation would need historical data)
            stats.user_growth = 0

            # Success rate (simplified - actual calculation would need more data)
            stats.success_rate = 0

            stats.save()

        # Additional statistics for the dashboard
        appointments_by_status = Appointment.objects.values("status").annotate(
            count=Count("status")
        )
        upcoming_events = Event.objects.filter(date__gte=today).count()

        # Combine all statistics
        dashboard_stats = {
            "stats": AdminStatsSerializer(stats).data,
            "appointments_by_status": appointments_by_status,
            "upcoming_events": upcoming_events,
        }

        return Response(dashboard_stats)
