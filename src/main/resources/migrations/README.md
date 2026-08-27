# Database Schema Management

This project uses a **model-first approach** with Hibernate auto-DDL generation.

## Schema Generation Strategy

The database schema is automatically generated and managed by Hibernate based on JPA entity annotations in the codebase.

### Configuration

In `application.properties`:
```properties
spring.jpa.hibernate.ddl-auto=validate
```

**DDL-Auto Modes:**
- `validate` - Validates schema matches entities but doesn't modify the database (production)
- `update` - Updates schema to match entities (development)
- `create` - Drops and recreates schema on startup (testing)
- `create-drop` - Creates schema on startup, drops on shutdown (testing)
- `none` - Disables Hibernate DDL features

### Current Approach

The project currently uses `validate` mode, which means:
- The database schema must already exist and match the JPA entities
- Hibernate validates the schema on startup but makes no modifications
- Schema changes require manual database updates or switching to `update` mode temporarily

### Entity-First Development

1. Define or modify JPA entities in `src/main/java/mg/taxibrousse/entities/`
2. Add proper JPA annotations (`@Entity`, `@Table`, `@Column`, `@Index`, etc.)
3. For development, temporarily switch to `update` mode to let Hibernate apply changes:
   ```properties
   spring.jpa.hibernate.ddl-auto=update
   ```
4. For production, use `validate` mode and apply schema changes through proper database migration tools

### Example Entity Structure

```java
@Entity
@Table(name = "shop_order", 
    indexes = {
        @Index(name = "idx_shop_order_status", columnList = "status"),
        @Index(name = "idx_shop_order_user", columnList = "user_account_id")
    }
)
public class OrderEntity extends BaseEntity {
    @Column(name = "order_number", nullable = false, length = 40)
    private String orderNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatusEnum status;
    
    // ... more fields
}
```

## Production Schema Management

For production deployments, consider using dedicated migration tools:

### Option 1: Flyway
Add to `pom.xml`:
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

### Option 2: Liquibase
Add to `pom.xml`:
```xml
<dependency>
    <groupId>org.liquibase</groupId>
    <artifactId>liquibase-core</artifactId>
</dependency>
```

These tools provide:
- Version-controlled schema migrations
- Automatic migration tracking
- Rollback capabilities
- Safe production deployments

## Best Practices

1. **Development**: Use `update` mode for rapid prototyping
2. **Staging**: Use `validate` mode with manual schema verification
3. **Production**: Use `validate` mode with proper migration tools
4. Always backup databases before schema changes
5. Test schema changes in non-production environments first
6. Keep entity definitions as the single source of truth for the data model
