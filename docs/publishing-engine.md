# Publishing & Scheduling Engine

Publishing is driven by BullMQ queues running over Redis.

## Queue Flow

```text
Scheduled Post -> Redis Delay Queue -> BullMQ Worker -> Platform Adapter -> Status Update
```

## Failure Isolation
Each platform version of a post is published as a distinct sub-job. A failure on one social network records a `PARTIALLY_PUBLISHED` state rather than failing the entire post execution.
