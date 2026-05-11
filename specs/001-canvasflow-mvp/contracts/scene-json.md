# Contract: Scene JSON

## Purpose
Portable import/export format for saved scene configurations.

## Shape
```json
{
  "version": 1,
  "scene": {
    "id": "scene-001",
    "name": "My Diorama",
    "styleProfileId": "pixel",
    "providerMode": "none",
    "viewport": {
      "width": 960,
      "height": 540,
      "backgroundTheme": "sunrise-grid"
    },
    "elements": []
  }
}
```

## Rules
- Unknown top-level fields MUST be ignored on import.
- Invalid element geometry MUST fail validation with a recoverable error message.
- Version mismatches MUST surface a non-destructive import error.
