from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Therapist, Schedule, Appointment, Payment, Review, Resource, 
    Event, EventRegistration, ReadingList, ReadingListItem, 
    Category, Notification, Message, UserProgress, AdminStats
)

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'role', 'profile_image', 'date_joined']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['id', 'day', 'time', 'is_available']


class TherapistSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='therapist'),
        source='user',
        write_only=True
    )
    time_slots = ScheduleSerializer(many=True, read_only=True)
    schedule = serializers.DictField(write_only=True, required=False)
    
    class Meta:
        model = Therapist
        fields = [
            'id', 'user', 'user_id', 'specialty', 'experience', 'availability',
            'price', 'languages', 'specializations', 'education', 'about',
            'rating', 'reviews_count', 'time_slots', 'schedule'
        ]
    
    def create(self, validated_data):
        schedule_data = validated_data.pop('schedule', {})
        therapist = Therapist.objects.create(**validated_data)
        
        # Create schedule time slots
        for day, times in schedule_data.items():
            for time in times:
                Schedule.objects.create(
                    therapist=therapist,
                    day=day,
                    time=time,
                    is_available=True
                )
        
        return therapist
    
    def update(self, instance, validated_data):
        schedule_data = validated_data.pop('schedule', None)
        
        # Update therapist fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update schedule if provided
        if schedule_data:
            # Remove existing schedule
            instance.time_slots.all().delete()
            
            # Create new schedule
            for day, times in schedule_data.items():
                for time in times:
                    Schedule.objects.create(
                        therapist=instance,
                        day=day,
                        time=time,
                        is_available=True
                    )
        
        return instance


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['amount', 'status', 'method', 'transaction_id', 'timestamp']


class AppointmentSerializer(serializers.ModelSerializer):
    payment = PaymentSerializer(read_only=True)
    payment_data = PaymentSerializer(write_only=True, required=False)
    user_name = serializers.CharField(source='user.username', read_only=True)
    therapist_name = serializers.CharField(source='therapist.user.username', read_only=True)
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'user', 'therapist', 'user_name', 'therapist_name',
            'date', 'time', 'status', 'type', 'notes', 'duration',
            'created_at', 'payment', 'payment_data'
        ]
    
    def create(self, validated_data):
        payment_data = validated_data.pop('payment_data', None)
        appointment = Appointment.objects.create(**validated_data)
        
        if payment_data:
            Payment.objects.create(appointment=appointment, **payment_data)
        
        return appointment


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'therapist', 'user_name', 'rating', 'comment', 'date', 'created_at']
    
    def create(self, validated_data):
        review = Review.objects.create(**validated_data)
        
        # Update therapist rating
        therapist = review.therapist
        reviews = Review.objects.filter(therapist=therapist)
        average_rating = reviews.aggregate(models.Avg('rating'))['rating__avg'] or 0
        
        therapist.rating = average_rating
        therapist.reviews_count = reviews.count()
        therapist.save()
        
        return review


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'author', 'description', 'category', 'tags',
            'url', 'featured', 'thumbnail_url', 'duration', 'type',
            'rating', 'reviews_count', 'created_at'
        ]


class EventRegistrationSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = EventRegistration
        fields = ['id', 'user', 'user_name', 'event', 'registration_date', 'payment_status']


class EventSerializer(serializers.ModelSerializer):
    registered_users = EventRegistrationSerializer(source='registrations', many=True, read_only=True)
    spots_left = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'date', 'time', 'location', 'category',
            'capacity', 'description', 'presenter', 'price', 'image',
            'created_at', 'registered_users', 'spots_left'
        ]
    
    def get_spots_left(self, obj):
        return obj.capacity - obj.registrations.count()


class ReadingListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadingListItem
        fields = ['id', 'title', 'order']


class ReadingListSerializer(serializers.ModelSerializer):
    books = ReadingListItemSerializer(many=True, read_only=True)
    book_list = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    book_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ReadingList
        fields = ['id', 'title', 'description', 'category', 'image', 'books', 'book_list', 'book_count', 'created_at']
    
    def get_book_count(self, obj):
        return obj.books.count()
    
    def create(self, validated_data):
        book_list = validated_data.pop('book_list', [])
        reading_list = ReadingList.objects.create(**validated_data)
        
        for index, book_title in enumerate(book_list):
            ReadingListItem.objects.create(
                reading_list=reading_list,
                title=book_title,
                order=index
            )
        
        return reading_list
    
    def update(self, instance, validated_data):
        book_list = validated_data.pop('book_list', None)
        
        # Update reading list fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update books if provided
        if book_list is not None:
            # Remove existing books
            instance.books.all().delete()
            
            # Create new books
            for index, book_title in enumerate(book_list):
                ReadingListItem.objects.create(
                    reading_list=instance,
                    title=book_title,
                    order=index
                )
        
        return instance


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'title', 'icon', 'color', 'count']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'role', 'title', 'message', 'type', 'read', 'date', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)
    receiver_name = serializers.CharField(source='receiver.username', read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'sender_name', 'receiver_name', 'message', 'timestamp', 'read', 'created_at']


class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = ['id', 'user', 'date', 'mood_rating', 'notes', 'completed_exercises', 'therapist_feedback', 'created_at']


class AdminStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminStats
        fields = ['date', 'total_therapists', 'active_users', 'appointments_today', 'total_resources', 'user_growth', 'success_rate']