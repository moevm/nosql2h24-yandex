# Этап сборки
FROM maven:3.9.9-eclipse-temurin-21 AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файл pom.xml и загружаем зависимости
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Этап выполнения
FROM openjdk:17-jdk-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем собранный JAR файл из этапа сборки
COPY --from=build /app/target/*.jar app.jar

# Запускаем приложение
ENTRYPOINT ["java", "-jar", "app.jar"]