# System Architecture

## Component Diagram
```mermaid
graph TD
    A[React Frontend] --> B[Next.js API]
    B --> C[Firebase Services]
    B --> D[NMI Payment Gateway]
    C --> E[(Firestore)]
    C --> F[Auth]
    C --> G[Storage]
    D --> H[Bank Network]
    
    style A fill:#61dafb,stroke:#333
    style B fill:#0070f3,stroke:#333
    style C fill:#ffcb2b,stroke:#333
    style D fill:#00c853,stroke:#333
```

## Payment Flow
```mermaid
sequenceDiagram
    participant Frontend
    participant API
    participant NMI
    participant Firestore
    
    Frontend->>API: POST /api/nmi/process
    API->>NMI: Process Payment
    NMI-->>API: Transaction Result
    API->>Firestore: Update Records
    Firestore-->>API: Confirmation
    API-->>Frontend: Payment Status
```

## Key Relationships
- See [Database Schema](db.md) for data model details
- [API Documentation](#api-endpoints) for integration points

## Error Handling
```mermaid
graph TD
    A[Request] --> B{Valid?}
    B -->|Yes| C[Process]
    B -->|No| D[Return 400]
    C --> E{Success?}
    E -->|Yes| F[Return 200]
    E -->|No| G[Retry Logic]
    G --> H{Retries < 3?}
    H -->|Yes| C
    H -->|No| I[Log Error]
