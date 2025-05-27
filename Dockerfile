# Use uma imagem base com Java 21 JDK para compilação
FROM eclipse-temurin:21-jdk AS builder

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie os arquivos do projeto (pom.xml, src, etc.)
COPY . .

# Construa a aplicação Spring Boot usando Maven
# Se você usa Gradle, ajuste o comando para './gradlew build'
RUN ./mvnw package -DskipTests

# Crie um estágio separado para a imagem final (mais leve) com JRE
FROM eclipse-temurin:21-jre AS final

# Defina o diretório de trabalho
WORKDIR /app

# Copie o arquivo JAR construído do estágio 'builder'
COPY --from=builder /app/target/*.jar app.jar

# Execute a aplicação Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]

# Exponha a porta que sua aplicação Spring Boot utiliza (geralmente 8080)
EXPOSE 8080