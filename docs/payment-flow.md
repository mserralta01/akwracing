# Payment Processing Flow

## Sequence Diagram
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant NMI
    participant Firestore
    
    User->>Frontend: Submit Payment
    Frontend->>API: POST /api/nmi/process
    API->>NMI: Process Transaction
    NMI-->>API: Result
    API->>Firestore: Update Invoice Status
    Firestore-->>API: Confirmation
    API-->>Frontend: Payment Result
    Frontend-->>User: Receipt
```

## Error Handling
```mermaid
graph TD
    A[Payment Initiated] --> B{Validation}
    B -->|Valid| C[NMI Processing]
    B -->|Invalid| D[Error: Invalid Input]
    C -->|Success| E[Update Firestore]
    C -->|Failure| F{Retry Logic}
    F -->|Retry Count < 3| C
    F -->|Max Retries| G[Log Error]
    G --> H[Notify Support]
```

## Related Documents
- [Database Schema](db.md)
- [API Documentation](#)
- [Security Implementation](db.md#security-implementation)
