[User]

- id (PK)
- username
- email
- password
- full_name
- phone_number
- role
- refreshToken
- refreshTokenExpiry
- created_at
- updated_at

Relationships:

- 1 User → N ServiceProvider (user_id)
- 1 User → N Appointment (customer_id)
- 1 User → N Notification (user_id)

[ServiceProvider]

- id (PK)
- user_id (FK) → User.id
- business_name
- address
- description

Relationships:

- 1 ServiceProvider → N Service (provider_id)
- 1 ServiceProvider → N Appointment (provider_id)
- 1 ServiceProvider → N ProviderAvailability (provider_id)

[Service]

- id (PK)
- provider_id (FK) → ServiceProvider.id
- name
- description
- duration_minutes
- price

Relationships:

- 1 Service → N Appointment (service_id)

[ProviderAvailability]

- id (PK)
- provider_id (FK) → ServiceProvider.id
- day_of_week
- start_time
- end_time

[Appointment]

- id (PK)
- customer_id (FK) → User.id
- service_id (FK) → Service.id
- provider_id (FK) → ServiceProvider.id
- start_time
- end_time
- status
- notes
- created_at
- updated_at

Relationships:

- 1 Appointment → N Notification (appointment_id)

[Notification]

- id (PK)
- appointment_id (FK) → Appointment.id
- user_id (FK) → User.id
- type
- sent_at
- status
- message
