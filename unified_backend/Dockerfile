FROM --platform=$BUILDPLATFORM python:3.10.11-slim AS base
# FROM --platform=$BUILDPLATFORM python:3.10.11-alpine@sha256:def82962a6ee048e54b5bec2fcdfd4aada4a907277ba6b0300f18c836d27f095 AS base

FROM base AS builder

# RUN apt-get update
RUN apt-get update \
    && apt-get install -y --no-install-recommends g++ \
    && rm -rf /var/lib/apt/lists/*

# get packages
COPY requirements.txt .
RUN pip install -r requirements.txt

FROM base
# enable unbuffered logging
ENV PYTHONUNBUFFERED=1
# enable profiler
ENV ENABLE_PROFILER=1

# RUN apt-get update \
#     && apt-get install -y libstdc++ \
#     && rm -rf /var/lib/apt/lists/*

WORKDIR /backend

# Grab packages from builder
COPY --from=builder /usr/local/lib/python3.10/ /usr/local/lib/python3.10/

# Add the application
COPY . .

EXPOSE 5000

ENTRYPOINT [ "python", "app.py" ]





