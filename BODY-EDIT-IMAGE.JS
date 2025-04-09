
// background.color
// string
// Color of the background. If omitted, background will be transparent unless background.imageUrl or background.imageFile is provided. Can be a hex color without the hash sign (example: FF0000, FF0000EE) or color name (examples: red, blue)Show all...

// background.expandPrompt
// any
// If ai.auto, a pre-processing step is applied to expand the prompt into a longer form.Show all...

// background.guidance.imageFile
// string<binary>
// Bytes of the image to use as a background image guidance. Only available in the POST requestShow all...

// background.guidance.scale
// number
// How closely the generated background will be matching the guiding image, between 0 and 1.Show all...

// background.imageFile
// string<binary>
// Bytes of the image to use as a background. Only available in the POST requestShow all...

// background.negativePrompt
// string
// (LEGACY) This parameter will only have an effect when using the previous AI Backgrounds model, which is used when setting the header: pr-ai-background-model-version: 2Show all...

// background.prompt
// string
// Prompt to use for guiding the background generation process.Show all...

// background.scaling
// string
// Whether the background should fit or fill (default) the output image If set to fit, the empty pixels will be transparentShow all...

// background.seed
// number
// Seed used to generate the background. Can be used to get similar looking results for the same prompt.

// expand.mode
// string
// Expand mode to use on the main image used by the API.Show all...

// expand.seed
// number
// Seed used to generate the background. Can be used to get similar looking results for the same prompt.

// export.dpi
// number
// The pixel density of the result image.Show all...

// export.format
// string
// The format of the result image.Show all...

// horizontalAlignment
// string
// [Advanced] Defines the horizontal alignment of the cutout subject within its bounding box.Show all...

// ignorePaddingAndSnapOnCroppedSides
// boolean
// If set to true (default), cropped sides of the subject will snap to the edges For instance, for a portrait image cropped below the elbows, the subject will be aligned at the bottom even if a bottom padding is provided (but it will still respect bottom margin)Show all...

// imageFile
// string<binary>
// Bytes of the main image used by the API. The POST endpoint accepts imageFile only.Show all...

// keepExistingAlphaChannel
// string
// If set to auto and if the image has transparency, the existing transparency will be used to cutout the subject.

// lighting.mode
// string
// Lighting mode to use on the main image used by the API. If set to ai.auto, the lighting will be automatically adjusted

// margin
// number or string
// General margin around the subject. Can be expressed as a number between 0 and 0.49, a percentage string between 0% and 49% (e.g., "30%"), or a pixel value string (e.g., "100px"). Unlike padding, margin is never ignored even on cropped sides of the subject. Expressed in a ratio of the output image size. See positioning section of the documentation for more information.Show all...

// marginBottom
// number or string
// Bottom Margin, overrides general margin on the bottom side. Accepts the same formats as margin.

// marginLeft
// number or string
// Left Margin, overrides general margin on the left side. Accepts the same formats as margin.

// marginRight
// number or string
// Right Margin, overrides general margin on the right side. Accepts the same formats as margin.

// marginTop
// number or string
// Top Margin, overrides general margin on the top side. Accepts the same formats as margin.

// maxHeight
// number
// Maximum output height. Can only be provided if outputSize is originalImage or croppedSubject. Useful for: redimensioning while keeping the aspect ratio

// maxWidth
// number
// Maximum output width. Can only be provided if outputSize is originalImage or croppedSubject. Useful for: resizing an image while keeping the aspect ratio

// outputSize
// string
// Output size of the image. In the form of either:

// auto to keep the template dimensions when templateId is defined, or behave like originalImage when templateId isn't defined (default)
// widthxheight for a custom size (example: 200x400)
// originalImage to keep the original image dimensions
// croppedSubject to use the size of the foreground dimensions after cropping around it
// padding
// number or string
// General padding around the subject. Can be expressed as a number between 0 and 0.49, a percentage string between 0% and 49% (e.g., "30%"), or a pixel value string (e.g., "100px"). Unlike margin, padding will be ignored on cropped sides of the subject if that option is enabled. Expressed in a ratio of the size of the document, minus margins (similar to CSS). See positioning section of the documentation for more information.Show all...

// paddingBottom
// number or string
// Bottom padding, overrides general padding on the bottom side. Accepts the same formats as padding.

// paddingLeft
// number or string
// Left padding, overrides general padding on the left side. Accepts the same formats as padding.

// paddingRight
// number or string
// Right padding, overrides general padding on the right side. Accepts the same formats as padding.

// paddingTop
// number or string
// Top padding, overrides general padding on the top side. Accepts the same formats as padding.

// referenceBox
// string
// [Advanced] subjectBox by default. When set to originalImage, the padding / margin will be around the original image and not the cropped subject.Show all...

// removeBackground
// boolean
// If enabled (default), the background of the image will be removed using PhotoRoom's award-winning algorithm

// scaling
// string
// Whether the subject should fit (default) or fill the output image If set to fit, the empty pixels will be transparentShow all...

// segmentation.mode
// string
// Controls whether or not the salient object should be kept or ignored by the segmentation model.

// segmentation.negativePrompt
// string
// A textual description of what the segmentation should remove.

// segmentation.prompt
// string
// A textual description of what the segmentation should keep.

// shadow.mode
// string
// Shadow generation mode to use on the main image used by the API. If set to ai.soft, a soft shadow will be generated If set to ai.hard, a hard shadow will be generated If set to ai.floating, a floating shadow will be generated

// templateId
// string<uuid>
// The ID of the template to render

// textRemoval.mode
// string
// Text removal mode to use on the main image used by the API.Show all...

// upscale.mode
// string
// (ALPHA) Warning: might get deprecated with a 2 weeks warningShow all...

// verticalAlignment
// string
// [Advanced] Defines the vertical alignment of the cutout subject within its bounding box.Show all...