# Multi-stage build for Java Spring Boot API
FROM maven:3.9-eclipse-temurin-25 AS builder

WORKDIR /taxibrousse

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -Pproduction -DskipTests

# Runtime stage
FROM eclipse-temurin:25-jre-alpine

WORKDIR /taxibrousse

# Install curl for health checks and tzdata for timezone support
RUN apk add --no-cache curl tzdata

# Set timezone
ENV TZ=Indian/Antananarivo

# Create non-root user
RUN addgroup -g 1001 -S spring && \
  adduser -S spring -u 1001

# Create logs directory with proper permissions
RUN mkdir -p /taxibrousse/logs && \
  chown -R spring:spring /taxibrousse/logs

# Copy JAR from builder
COPY --from=builder /taxibrousse/target/*.jar taxibrousse.jar

# Change ownership of the JAR file
RUN chown spring:spring taxibrousse.jar

# Switch to non-root user
USER spring

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://127.0.0.1:8080/actuator/health || exit 1

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "taxibrousse.jar"]