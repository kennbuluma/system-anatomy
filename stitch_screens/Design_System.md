# Design System: Technical Minimalism for System Anatomy

## 1. Overview & Creative North Star: \"The Architectural Blueprint\"

This design system is built for 'System Anatomy', a high-end technical consultancy. The objective is to move beyond standard corporate UI into an \"Editorial Engineering\" aesthetic. We are not just building screens; we are drafting digital blueprints.

**The Creative North Star: The Architectural Blueprint**
The system treats the interface as a high-fidelity schematic. It is precise, intentional, and authoritative. We break the \"template\" look by using **intentional asymmetry**—aligning technical data to a rigorous grid while allowing headlines to breathe with expansive, asymmetrical whitespace. We favor depth through tonal layering over traditional borders, creating an environment that feels like a premium, backlit command center.

---

## 2. Colors: Tonal Depth & The Neon Pulse

The palette is rooted in deep, light-absorbing charcoals to ensure the 'Neon Cyan' accents feel like active light sources rather than mere colors.

### The Palette Logic
- **Background & Surfaces:** We utilize a range of `surface` tokens from `surface_container_lowest` (#0e0e0e) to `surface_bright` (#393939).
- **Primary Accent:** `primary_container` (#00f5ff) is our \"Neon Cyan.\" It is reserved for high-signal actions and data-rich visualizations.
- **Technical Secondary:** `secondary` (#bcc7de) and its variants provide a muted slate contrast, cooling down the warmth of the deep charcoals.

### The \"No-Line\" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. Traditional boxes feel \"boxed in.\" Instead, boundaries must be defined through background color shifts. A `surface_container_low` section sitting on a `surface` background is sufficient to denote a change in context. 

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
- **Base Layer:** `surface` (#131313).
- **In-Page Containers:** `surface_container_low` (#1c1b1b).
- **Interactive Elements/Cards:** `surface_container` (#201f1f).
By nesting a `surface_container_highest` element inside a `surface_container_low` section, you create a sense of architectural \"lift\" without adding visual clutter.

### The \"Glass & Gradient\" Rule
For floating menus or high-end modals, use **Glassmorphism**. Apply a semi-transparent `surface_container_highest` with a `backdrop-blur` of 20px. To give primary CTAs \"soul,\" use a subtle linear gradient transitioning from `primary_fixed_dim` (#00dce5) to `primary_container` (#00f5ff) at a 135-degree angle.

---

## 3. Typography: The Dialogue of Precision

We employ a dual-typeface strategy to balance human-centric communication with technical authority.

- **Inter (Sans-serif):** Our \"Voice of Reason.\" Used for all `display`, `headline`, and `body` scales. It provides the \"Professional and Trustworthy\" feel. Use `display-lg` (3.5rem) with a negative letter-spacing of -0.02em for a high-end editorial impact.
- **JetBrains Mono (Monospace):** Our \"Voice of Precision.\" Used for `label-sm`, `label-md`, and any data-driven technical details. This conveys the \"Architecturally Sound\" nature of the brand.

**Hierarchy Strategy:**
Always pair a large `headline-lg` in Inter with a small, uppercase `label-sm` in JetBrains Mono. This contrast between \"Human\" and \"Machine\" is the core of the System Anatomy identity.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are too \"web 2.0\" for this system. We use **Ambient Light** and **Material Stacking**.

### The Layering Principle
Depth is achieved by \"stacking\" the surface-container tiers. 
*   **Level 0 (Background):** `surface`
*   **Level 1 (Section):** `surface_container_low`
*   **Level 2 (Card/Object):** `surface_container`

### Ambient Shadows
When an element must float (e.g., a dropdown), use an extra-diffused shadow:
- **Blur:** 40px to 60px.
- **Opacity:** 6% - 10%.
- **Color:** Use a tinted version of the background (`surface_container_lowest`), not pure black, to simulate natural light absorption.

### The \"Ghost Border\" Fallback
If a border is required for accessibility, use the **Ghost Border**: `outline_variant` (#3a494a) at 20% opacity. It should be felt, not seen.

---

## 5. Components: Precision Engineered

### Buttons
- **Primary:** Gradient fill (`primary_fixed_dim` to `primary_container`). Text: `on_primary` (#003739). Border-radius: `md` (0.375rem).
- **Secondary:** Surface-only. Background: `surface_container_highest`. Ghost border applied.
- **Tertiary:** Text-only in `primary_fixed`, paired with a JetBrains Mono label for a \"terminal\" feel.

### Input Fields
- **Styling:** Use `surface_container_lowest` for the input well. 
- **Focus State:** No thick glow. Instead, transition the \"Ghost Border\" to 100% opacity `primary_container` and add a subtle 2px inner-shadow.
- **Technical Details:** Use `label-sm` (JetBrains Mono) for helper text to emphasize technical accuracy.

### Cards & Lists
- **Rule:** Forbid the use of divider lines. 
- **Implementation:** Separate list items using `spacing-3` (1rem) and subtle background shifts. For cards, use `surface_container_low` and generous internal padding (`spacing-6`).

### Technical Data Tags (Custom Component)
- **Style:** Small, high-contrast chips. Background: `secondary_container`. Text: `on_secondary_container` in JetBrains Mono. These should look like metadata tags in a code editor.

---

## 6. Do's and Don'ts

### Do:
- **Use Generous Whitespace:** Use `spacing-16` (5.5rem) or `spacing-20` (7rem) between major sections to allow the \"Architecture\" to breathe.
- **Monospace for Numbers:** Always use JetBrains Mono for coordinates, timestamps, and currency to maintain the technical aesthetic.
- **Asymmetric Layouts:** Align text to the left but allow data visualizations to break the grid on the right.

### Don't:
- **Don't use 100% Opacity Borders:** They create \"visual noise\" that contradicts the minimalism.
- **Don't use Bright Colors for Backgrounds:** Stay within the charcoal/slate range to keep the \"Technical\" atmosphere.
- **Don't use Standard Easing:** Use \"Exponential Out\" or \"Quintic\" easing for transitions to make the UI feel responsive and high-end, rather than \"linear\" or \"mechanical.\"
- **Don't use Rounded Corners on Everything:** Stick to `md` (0.375rem) for interactive elements and `none` for large structural containers to maintain a \"crisp\" architectural edge.