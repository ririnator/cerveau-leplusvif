# Cerveau Vif - Assets

## Required Assets

### 1. icon.png
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Design**: Square, no rounded corners (iOS handles this)
- **Content**: "CV" monogram or "Cerveau Vif" symbol on dark background
- **Colors**: Use brand colors (primary #6366f1 on dark #0a0a0a)

### 2. adaptive-icon.png (Android)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Design**: Foreground only (no background, no padding)
- **Safe area**: Keep important content in center 66% circle
- **Background**: Set via `backgroundColor: "#0a0a0a"` in app.config.ts

### 3. splash.png
- **Size**: 3000x3000 pixels minimum (or larger for high-res devices)
- **Format**: PNG
- **Design**: Centered "Cerveau Vif" wordmark on solid dark background
- **Colors**: Background #0a0a0a, text/logo in brand colors
- **Safe area**: Keep content in center to avoid notch/status bar overlap

### 4. favicon.png (Web, optional)
- **Size**: 48x48 pixels
- **Format**: PNG
- **Design**: Simplified icon version

## Current Status

**Placeholders generated**: Simple solid color placeholders for testing
**Production assets**: Replace these with professional designs before app store submission

## Tools for Creating Assets

- **Figma/Sketch**: Design all assets at required sizes
- **Export**: PNG format with appropriate transparency
- **Optimize**: Use ImageOptim or similar to reduce file size without quality loss

## Validation

After adding assets, verify:
```bash
# Check file sizes
ls -lh assets/

# Ensure referenced in app.config.ts
cat app.config.ts | grep -E "icon|splash|adaptive"

# Test on simulator
npm run ios
npm run android
```

All assets should appear correctly on splash screen and home screen icons.
