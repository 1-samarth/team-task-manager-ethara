FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN ./../apache-maven-3.9.16/bin/mvn clean package || echo "Using existing jar"

EXPOSE 8080

CMD ["java", "-jar", "target/team-task-manager-0.0.1-SNAPSHOT.jar"]