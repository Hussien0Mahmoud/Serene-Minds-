from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator


class CustomUser(AbstractUser):
    """Custom user model with role-based authentication"""

    ROLE_CHOICES = (
        ("user", "User"),
        ("therapist", "Therapist"),
        ("admin", "Admin"),
    )

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="user")
    profile_image = models.URLField(blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    USERNAME_FIELD = "email"

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class Therapist(models.Model):
    """Therapist profile model"""

    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name="therapist_profile"
    )
    specialty = models.CharField(max_length=100)
    experience = models.PositiveIntegerField(help_text="Years of experience")
    availability = models.BooleanField(default=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    languages = models.JSONField(default=dict, blank=True)
    specializations = models.JSONField(default=dict, blank=True)
    education = models.JSONField(default=dict, blank=True)
    about = models.TextField(blank=True)
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.0,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
    )
    reviews_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.specialty}"


class Schedule(models.Model):
    """Therapist schedule model"""

    DAYS_OF_WEEK = [
        ("Monday", "Monday"),
        ("Tuesday", "Tuesday"),
        ("Wednesday", "Wednesday"),
        ("Thursday", "Thursday"),
        ("Friday", "Friday"),
        ("Saturday", "Saturday"),
        ("Sunday", "Sunday"),
    ]

    therapist = models.ForeignKey(
        Therapist, on_delete=models.CASCADE, related_name="time_slots"
    )
    day = models.CharField(max_length=10, choices=DAYS_OF_WEEK)
    time = models.CharField(max_length=5)  # Format: "HH:MM"
    is_available = models.BooleanField(default=True)

    class Meta:
        unique_together = ("therapist", "day", "time")

    def __str__(self):
        return f"{self.therapist.user.username} - {self.day} {self.time}"


class Appointment(models.Model):
    """Appointment model for booking sessions with therapists"""

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Confirmed", "Confirmed"),
        ("Cancelled", "Cancelled"),
        ("Completed", "Completed"),
    ]

    TYPE_CHOICES = [
        ("Video Call", "Video Call"),
        ("Audio Call", "Audio Call"),
        ("In-Person", "In-Person"),
        ("Chat", "Chat"),
    ]

    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="appointments"
    )
    therapist = models.ForeignKey(
        Therapist, on_delete=models.CASCADE, related_name="appointments"
    )
    date = models.CharField(max_length=20)  # Day of week or specific date
    time = models.CharField(max_length=5)  # Format: "HH:MM"
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Pending")
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default="Video Call")
    notes = models.TextField(blank=True)
    duration = models.PositiveIntegerField(default=60)  # Duration in minutes
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} with {self.therapist.user.username} on {self.date} at {self.time}"


class Payment(models.Model):
    """Payment model for appointments"""

    PAYMENT_STATUS = [
        ("Pending", "Pending"),
        ("Paid", "Paid"),
        ("Failed", "Failed"),
        ("Refunded", "Refunded"),
    ]

    PAYMENT_METHOD = [
        ("card", "Credit/Debit Card"),
        ("paypal", "PayPal"),
        ("bank_transfer", "Bank Transfer"),
    ]

    appointment = models.OneToOneField(
        Appointment, on_delete=models.CASCADE, related_name="payment"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=PAYMENT_STATUS, default="Pending")
    method = models.CharField(max_length=15, choices=PAYMENT_METHOD)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for {self.appointment.id} - {self.status}"


class Review(models.Model):
    """Review model for therapist reviews"""

    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="reviews"
    )
    therapist = models.ForeignKey(
        Therapist, on_delete=models.CASCADE, related_name="reviews"
    )
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "therapist")

    def __str__(self):
        return f"{self.user.username}'s review for {self.therapist.user.username}"


class Resource(models.Model):
    """Resource model for educational resources"""

    TYPE_CHOICES = [
        ("Video", "Video"),
        ("Article", "Article"),
        ("Podcast", "Podcast"),
        ("Ebook", "Ebook"),
        ("Tool", "Tool"),
    ]

    title = models.CharField(max_length=255)
    author = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=100)
    tags = models.JSONField(default=dict, blank=True)
    url = models.URLField()
    featured = models.BooleanField(default=False)
    thumbnail_url = models.URLField(blank=True, null=True)
    duration = models.CharField(
        max_length=10, blank=True, null=True
    )  # Duration in format "MM:SS" or text
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
    )
    reviews_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Event(models.Model):
    """Event model for workshops, webinars, etc."""

    CATEGORY_CHOICES = [
        ("Workshop", "Workshop"),
        ("Webinar", "Webinar"),
        ("Group Session", "Group Session"),
        ("Conference", "Conference"),
        ("Training", "Training"),
    ]

    title = models.CharField(max_length=255)
    date = models.DateField()
    time = models.CharField(max_length=50)  # Format: "10 AM - 12 PM"
    location = models.CharField(max_length=255)
    category = models.CharField(max_length=15, choices=CATEGORY_CHOICES)
    capacity = models.PositiveIntegerField()
    description = models.TextField()
    presenter = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.date}"


class EventRegistration(models.Model):
    """Event registration model for users registering for events"""

    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="event_registrations"
    )
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="registrations"
    )
    registration_date = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(
        max_length=10, choices=Payment.PAYMENT_STATUS, default="Pending"
    )

    class Meta:
        unique_together = ("user", "event")

    def __str__(self):
        return f"{self.user.username} - {self.event.title}"


class ReadingList(models.Model):
    """Reading lists for curated resources"""

    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100)
    image = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ReadingListItem(models.Model):
    """Items in reading lists"""

    reading_list = models.ForeignKey(
        ReadingList, on_delete=models.CASCADE, related_name="books"
    )
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.title} - {self.reading_list.title}"


class Category(models.Model):
    """Categories for resources and reading lists"""

    title = models.CharField(max_length=100)
    icon = models.CharField(max_length=50)
    color = models.CharField(max_length=10)
    count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title


class Notification(models.Model):
    """Notifications model"""

    TYPE_CHOICES = [
        ("system", "System"),
        ("appointment", "Appointment"),
        ("message", "Message"),
        ("event", "Event"),
    ]

    ROLE_CHOICES = [
        ("all", "All"),
        ("user", "User"),
        ("therapist", "Therapist"),
        ("admin", "Admin"),
    ]

    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="notifications",
        null=True,
        blank=True,
    )
    role = models.CharField(max_length=250, choices=ROLE_CHOICES, default="all")
    title = models.CharField(max_length=100)
    message = models.TextField()
    type = models.CharField(max_length=250, choices=TYPE_CHOICES)
    read = models.BooleanField(default=False)
    date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.date}"


class Message(models.Model):
    """Messages between users and therapists"""

    sender = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="sent_messages"
    )
    receiver = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="received_messages"
    )
    message = models.TextField()
    timestamp = models.DateTimeField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender.username} to {self.receiver.username}"


class UserProgress(models.Model):
    """User progress tracking model"""

    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="progress_records"
    )
    date = models.DateField()
    mood_rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)]
    )
    notes = models.TextField(blank=True)
    completed_exercises = models.JSONField(default=list, blank=True)
    therapist_feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s progress on {self.date}"


class AdminStats(models.Model):
    """Admin statistics model"""

    date = models.DateField(unique=True)
    total_therapists = models.PositiveIntegerField(default=0)
    active_users = models.PositiveIntegerField(default=0)
    appointments_today = models.PositiveIntegerField(default=0)
    total_resources = models.PositiveIntegerField(default=0)
    user_growth = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    success_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    def __str__(self):
        return f"Admin Stats - {self.date}"
