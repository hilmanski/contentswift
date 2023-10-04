FROM golang:1.17 AS builder

WORKDIR /app

# Copy the Go mod file
COPY ./go-app/go.mod ./

# Conditionally copy the Go sum file, if it exists
COPY ./go-app/go.sum ./

# Copy the Go source code
COPY ./go-app/main.go .

# Download dependencies (can be cached)
RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
