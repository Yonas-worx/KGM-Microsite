# KGM UAE Microsite — Claude Project Instructions

## 1. Project Identity

Project name: KGM UAE Microsite

This is a premium, bilingual, mobile-first microsite designed to introduce KGM to the UAE market and capture early customer interest before the first vehicles arrive.

The project is based on the approved:

`docs/project-brief.md`

The original proposal is located in:

`docs/KGM UAE Microsite-QuickStart Proposal 2026 _ by Worx (1).pptx`

The project brief and approved stakeholder decisions are the primary sources of truth for development.

---

## 2. Primary Project Goal

The primary goal of this project is to create a focused, premium microsite that:

1. Introduces KGM's presence in the UAE.
2. Presents the approved KGM vehicle lineup.
3. Creates desire through premium imagery and visual storytelling.
4. Provides showroom information.
5. Captures qualified leads through a short interest form.
6. Provides WhatsApp contact.
7. Supports English and Arabic from launch.
8. Supports marketing measurement through GA4.

The central user journey is:

ARRIVE → EXPLORE → TRUST → REGISTER

The primary conversion goal is:

REGISTER INTEREST

---

## 3. Approved Microsite Scope

The microsite is a single-page experience containing these core sections:

1. Hero
2. The Models
3. Gallery
4. Showrooms
5. Register Interest

Persistent functionality includes:

- EN | AR language switching.
- Register Interest CTA.
- WhatsApp click-to-chat.
- PDPL privacy and consent.

Do not add major new sections without explicit approval.

---

## 4. Explicitly Excluded Scope

The following are not part of the quick-start microsite unless explicitly approved:

- CMS.
- CRM integration.
- News.
- FAQs.
- Warranty content.
- Seven individual model detail pages.
- Full website architecture.
- Complex account systems.
- Unapproved third-party integrations.

If a requested feature expands the project beyond this scope, identify it before implementing it.

---

## 5. Design Direction

The design should feel:

- Premium.
- Cinematic.
- Modern.
- Automotive.
- Image-led.
- Confident.
- Focused.
- Minimal in copy.

The experience should prioritize:

- Strong imagery.
- Clear hierarchy.
- Short lines of copy.
- Smooth scrolling.
- Strong visual transitions.
- Clear calls to action.
- Mobile usability.

Avoid:

- Walls of text.
- Unnecessary UI complexity.
- Generic templates.
- Excessive decoration.
- Unnecessary animations.
- Design elements that distract from vehicles and lead capture.

The design should feel intentional and high-end rather than like a generic car dealership website.

---

## 6. User Journey

The experience should guide the user through:

### ARRIVE

Create an immediate cinematic impression of KGM's arrival in the UAE.

### EXPLORE

Show the approved KGM models using imagery, model names, and three key numbers.

### TRUST

Use the gallery and showroom information to build confidence.

### REGISTER

Make it easy to submit interest in a model.

Every major design and UX decision should support this journey.

---

## 7. Bilingual Requirements

English and Arabic must be treated as equal first-class experiences.

English uses:

- LTR layout.
- LTR navigation.
- LTR forms.

Arabic uses:

- RTL layout.
- Mirrored navigation.
- Mirrored forms.
- Mirrored sliders and layout patterns.
- Cairo typography.
- Appropriate Arabic line-height.

Do not treat Arabic as simply translated English text.

When implementing a component, always consider both:

- LTR behavior.
- RTL behavior.

Test both language directions.

---

## 8. Language Switching

The interface must support:

```text
EN | AR
```

The language switcher should be easy to find.

Language switching should preserve the user's position or provide an intuitive equivalent experience where technically appropriate.

Do not create a language switcher that only changes text while leaving the layout direction incorrect.

---

## 9. Content Rules

Use approved project content wherever available.

The following must not be invented:

- Vehicle specifications.
- Vehicle performance figures.
- Model features.
- Showroom addresses.
- Opening hours.
- Sales email addresses.
- WhatsApp numbers.
- Legal wording.
- PDPL wording.
- Brand claims.

If required information is missing, clearly identify it as:

`CONTENT REQUIRED`

or:

`NOT SPECIFIED IN PROJECT MATERIALS`

Ask for confirmation rather than inventing facts.

---

## 10. Model Content

The potential model lineup includes:

- Tivoli.
- Torres.
- Torres Hybrid.
- Actyon.
- Rexton.
- Musso.
- Musso EV.

The final lineup depends on the models confirmed for the UAE launch.

Only use confirmed models in the final production experience.

Each model may require:

- Model name.
- Approved imagery.
- Three approved key numbers.

Do not invent the three key numbers.

---

## 11. Lead Capture

The Register Interest form is a primary project feature.

The form should be:

- Short.
- Mobile-friendly.
- Easy to understand.
- Approximately 30 seconds to complete.

The proposal identifies these fields:

- Name.
- Phone.
- Emirate.
- Model of interest.

The form must support:

- Validation.
- Spam protection.
- Bot protection.
- PDPL consent.
- Consent recording.

The form should clearly communicate:

- What information is required.
- Whether a field contains an error.
- Whether the submission was successful.
- What happens after submission.

---

## 12. Lead Handling

The lead workflow is:

FILL → VALIDATE → NOTIFY → FOLLOW UP

The system should support:

1. User submits the form.
2. Data is validated.
3. Spam and bot protection are applied.
4. PDPL consent is recorded.
5. The appropriate sales recipient is notified.
6. The lead is recorded in a backup running sheet or equivalent system.

The inbox should not be the only copy of a lead.

Direct CRM integration is outside the quick-start scope unless explicitly approved.

---

## 13. WhatsApp

The site should include click-to-chat WhatsApp functionality.

The final WhatsApp number must come from approved project information.

Do not invent a phone number.

The default message should be approved before implementation.

---

## 14. Showrooms

The Showrooms section should support:

- Showroom location information.
- Opening hours.
- Live map.
- Directions.

Do not invent:

- Addresses.
- Locations.
- Opening times.
- Coordinates.

If the information is not available, use a clear placeholder and identify the required content.

---

## 15. Analytics

GA4 should be implemented.

Track important user actions, including:

- Register Interest CTA clicks.
- Form starts.
- Successful form submissions.
- WhatsApp clicks.
- Language switching.
- Showroom interactions.
- Direction clicks where applicable.

Use clear, consistent event names.

Do not create a complicated analytics system without a project requirement.

The final GA4 Measurement ID must come from the project owner.

---

## 16. SEO

The microsite should support SEO essentials.

The project requires:

- English and Arabic language support.
- `hreflang`.

Do not invent final SEO copy.

Page titles, meta descriptions, canonical URLs, and other metadata should use approved content.

---

## 17. Accessibility

The site should be accessible and usable.

Pay attention to:

- Semantic HTML.
- Keyboard navigation.
- Form labels.
- Focus states.
- Image alt text.
- Color contrast.
- Touch target sizes.
- Clear error messages.

Do not sacrifice usability for visual effects.

---

## 18. Performance

The site is image-led, but performance remains important.

Prioritize:

- Optimized images.
- Appropriate image formats.
- Lazy loading where appropriate.
- Avoiding unnecessary JavaScript.
- Avoiding unnecessary dependencies.
- Fast mobile loading.

Do not add large libraries when a simpler solution is sufficient.

---

## 19. Responsive Design

Build mobile-first.

The experience must work across:

- Mobile phones.
- Tablets.
- Desktop screens.

Do not design desktop first and attempt to repair mobile later.

Every major component must be checked at:

- Small mobile width.
- Large mobile width.
- Tablet width.
- Desktop width.
- Wide desktop width.

---

## 20. Development Principles

Before implementing a feature:

1. Understand the requirement.
2. Check the project brief.
3. Check whether required content is available.
4. Consider English and Arabic behavior.
5. Consider mobile behavior.
6. Consider accessibility.
7. Consider performance.
8. Implement the simplest appropriate solution.
9. Test the result.

Do not create unnecessary complexity.

---

## 21. File and Code Organization

Keep the project organized.

Use clear file and folder names.

Separate:

- Structure.
- Styling.
- JavaScript behavior.
- Data.
- Assets.

Avoid placing large amounts of unrelated logic in a single file.

Use reusable components where appropriate.

Do not duplicate code unnecessarily.

---

## 22. Git Workflow

The project uses two primary branches:

`Staging`

and:

`main`

### Development

All development work should happen on:

`Staging`

The workflow is:

1. Make changes on `Staging`.
2. Test locally.
3. Review the changes.
4. Commit with a clear message.
5. Push to `origin/Staging`.
6. Review the staging version.
7. Merge or promote approved work to `main`.

Do not make experimental changes directly on `main`.

---

## 23. Commit Rules

Use clear commit messages.

Examples:

```text
Add KGM microsite hero section
Add vehicle lineup section
Add bilingual language switcher
Implement Arabic RTL layout
Add showroom section
Add interest form validation
Add GA4 event tracking
Fix mobile navigation
Improve Arabic form layout
```

Avoid vague messages such as:

```text
changes
updates
fix
stuff
```

---

## 24. Before Changing Files

Before making substantial changes:

- Inspect the existing project structure.
- Read relevant files.
- Understand how the current code works.
- Avoid overwriting working functionality unnecessarily.

Prefer targeted changes over large destructive rewrites.

---

## 25. Before Installing Dependencies

Before installing a package:

1. Check whether the functionality can be implemented without it.
2. Check whether an existing dependency already provides the functionality.
3. Consider the impact on performance and maintenance.

Do not install packages unnecessarily.

---

## 26. Testing Requirements

Before considering a feature complete, test:

### Visual

- Desktop.
- Tablet.
- Mobile.

### Language

- English.
- Arabic.
- LTR.
- RTL.

### Forms

- Empty fields.
- Invalid fields.
- Valid submission.
- Consent requirements.
- Error states.
- Success state.

### Interaction

- Navigation.
- CTA buttons.
- Language switcher.
- WhatsApp.
- Showroom directions.

### Performance

- Image loading.
- Mobile experience.
- Console errors.

---

## 27. Missing Information Rule

When a required project detail is not provided:

DO NOT GUESS.

Instead:

1. Identify the missing information.
2. Mark it clearly.
3. Continue with a safe placeholder only when appropriate.
4. Ask for confirmation before treating it as final.

Examples:

```text
CONTENT REQUIRED: WhatsApp number
CONTENT REQUIRED: Sales notification email
CONTENT REQUIRED: Final model lineup
CONTENT REQUIRED: Showroom opening hours
CONTENT REQUIRED: PDPL consent wording
```

---

## 28. Scope Protection

The purpose of this project is a focused launch microsite.

If a new request introduces:

- CMS functionality.
- CRM integration.
- New major sections.
- Individual model websites.
- Complex backend systems.
- Unapproved integrations.

Flag the scope change before implementing it.

Do not silently expand the project.

---

## 29. Working Style

Work incrementally.

Prefer this sequence:

1. Inspect.
2. Plan.
3. Implement one feature.
4. Test.
5. Review.
6. Commit.

Do not build the entire website in one uncontrolled operation.

Explain important architectural decisions.

When a decision could materially affect the project, ask for confirmation rather than making an irreversible assumption.

---

## 30. Definition of Done

A feature is complete only when:

- It matches the approved project direction.
- It works on mobile.
- It works on desktop.
- It has been considered for Arabic RTL.
- It does not introduce console errors.
- It does not break existing features.
- It uses approved content.
- It is tested locally.
- It is committed to the appropriate Git branch.

---

## 31. Final Project Principle

The KGM UAE Microsite should be:

> Beautiful enough to create desire. Simple enough to create action.

The primary objective is not to build the biggest website.

The objective is to create a premium, bilingual, focused launch experience that moves users through:

ARRIVE → EXPLORE → TRUST → REGISTER

Every design, content, and technical decision should support that objective.
