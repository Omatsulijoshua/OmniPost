# OmniPost Architecture Overview

OmniPost is designed around modular, decoupled, and asynchronous services to guarantee reliability during high-volume social media publishing and video processing.

## High-Level Diagram

```text
                                 OMNIPOST
                                    │
                      ┌─────────────┴─────────────┐
                      │                           │
                   WEB APP                    ADMIN APP
                 (Next.js)                    (Next.js)
                      │                           │
                      └─────────────┬─────────────┘
                                    │
                                 REST API
                                (NestJS)
                                    │
               ┌────────────────────┼────────────────────┐
               │                    │                    │
            Auth Service        Content Service      AI Service
               │                    │                    │
               │              Media Service        OpenAI / Gemini
               │                    │
               │                FFmpeg Presets
               │
               └────────────────────┬────────────────────
                                    │
                             Publishing Engine
                                    │
                            ┌───────┴────────┐
                            │                │
                          Redis           BullMQ Queue
                            │                │
                            └───────┬────────┘
                                    │
                          Platform Adapters
                                    │
              ┌─────────┬────────┬──┼──┬─────────┬─────────┐
              │         │        │  │  │         │         │
           Instagram TikTok YouTube X LinkedIn Telegram Discord ...
```

## System Guarantees

1. **Platform Independence**: Each social platform adapter (`InstagramAdapter`, `TikTokAdapter`, `XAdapter`, etc.) implements the isolated `PlatformAdapter` interface. Adding or altering one adapter never disrupts another platform's logic.
2. **Partial Success Resilience**: Multi-platform publishing runs each platform job independently inside BullMQ. If publishing to YouTube fails due to quota limit, Instagram and LinkedIn publishing succeed independently.
3. **Decoupled AI Engine**: AI providers (OpenAI, Gemini) implement the `AIProvider` contract. Content adaptation fallback and provider switching can occur dynamically without altering UI or queue code.
