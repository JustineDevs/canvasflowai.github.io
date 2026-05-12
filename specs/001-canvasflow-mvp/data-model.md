# Data Model: CanvasFlow AI MVP

## Scene
- `id`: string
- `name`: string
- `styleProfileId`: string
- `elements`: SceneElement[]
- `viewport`: SceneViewport
- `providerMode`: `none | local | cloud`

Validation rules:
- Must contain at least zero elements
- Must contain exactly one viewport
- Must reference a known style profile identifier

## SceneElement
- `id`: string
- `kind`: `persona | tech | environment`
- `label`: string
- `x`: number
- `y`: number
- `width`: number
- `height`: number
- `rotation`: number
- `zIndex`: number

Validation rules:
- `width` and `height` must be positive
- `label` must be non-empty

## StyleProfile
- `id`: string
- `name`: string
- `tone`: string
- `descriptor`: string

## PromptSummary
- `title`: string
- `body`: string
- `relationships`: string[]

## ExportDraft
- `format`: `png | webp | gif`
- `estimatedBytes`: number
- `withinBudget`: boolean
- `budgetLabel`: string

## ProviderProfile
- `mode`: `none | local | cloud`
- `label`: string
- `connectionState`: `idle | unavailable | ready`

## SceneViewport
- `width`: number
- `height`: number
- `backgroundTheme`: string
