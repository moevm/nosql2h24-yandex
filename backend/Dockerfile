FROM maven:3.9.9-eclipse-temurin-21

WORKDIR /app

COPY src ./src
COPY pom.xml .

RUN mvn clean package

COPY ./target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]