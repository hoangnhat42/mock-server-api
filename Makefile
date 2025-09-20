VERSION=1.0.0
IMAGE_NAME=mock-server-api
REGISTRY=ghcr.io
USERNAME=hoangnhat42

deploy:
	@echo "Building Docker image for linux/amd64 platform..."
	@docker build --platform=linux/amd64 -t $(IMAGE_NAME):$(VERSION) -f Dockerfile .
	@echo "Tagging image for GitHub Container Registry..."
	@docker tag $(IMAGE_NAME):$(VERSION) $(REGISTRY)/$(USERNAME)/$(IMAGE_NAME):$(VERSION)
	@docker tag $(IMAGE_NAME):$(VERSION) $(REGISTRY)/$(USERNAME)/$(IMAGE_NAME):latest
	@echo "Pushing image to GitHub Container Registry..."
	@docker push $(REGISTRY)/$(USERNAME)/$(IMAGE_NAME):$(VERSION)
	@docker push $(REGISTRY)/$(USERNAME)/$(IMAGE_NAME):latest
	@echo "Deploying to GCP server..."
	@./startserver-gcp.sh
	@echo "Deployment completed successfully!"
	@echo "Image available at: $(REGISTRY)/$(USERNAME)/$(IMAGE_NAME):$(VERSION)"

dev:
	@echo "Starting local development environment..."
	@docker-compose up --build

dev-stop:
	@echo "Stopping local development environment..."
	@docker-compose down

deploy-local:
	@echo "Building Docker image for local development..."
	@docker build -t $(IMAGE_NAME):$(VERSION) -f Dockerfile .
	@echo "Starting services with docker-compose..."
	@docker-compose up -d

clean:
	@echo "Cleaning up local Docker images..."
	@docker rmi $(IMAGE_NAME):$(VERSION) || true
	@docker rmi $(REGISTRY)/$(USERNAME)/$(IMAGE_NAME):$(VERSION) || true
	@docker rmi $(REGISTRY)/$(USERNAME)/$(IMAGE_NAME):latest || true

help:
	@echo "Available commands:"
	@echo "  deploy       - Build and push image to GitHub Container Registry + deploy to server"
	@echo "  dev          - Start local development environment with hot reload"
	@echo "  dev-stop     - Stop local development environment"
	@echo "  deploy-local - Build and run locally with docker-compose (production mode)"
	@echo "  clean        - Remove local Docker images"
	@echo "  help         - Show this help message"
