FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Этап выполнения
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
COPY uploads/tables/* /app/backend/uploads/tables/
ENTRYPOINT ["java", "-jar", "app.jar"]
EXPOSE 8080