import { Extension } from '@tiptap/core'

export const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px']
const DEFAULT_SIZE = '16px'

export const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {}
              return { style: `font-size: ${attributes.fontSize}` }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) =>
          chain().setMark('textStyle', { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain()
            .setMark('textStyle', { fontSize: null })
            .removeEmptyTextStyle()
            .run(),
      increaseFontSize:
        () =>
        ({ editor }) => {
          const current = editor.getAttributes('textStyle').fontSize || DEFAULT_SIZE
          const idx = FONT_SIZES.indexOf(current)
          if (idx < FONT_SIZES.length - 1) {
            return editor.chain().setFontSize(FONT_SIZES[idx + 1]).run()
          }
          return false
        },
      decreaseFontSize:
        () =>
        ({ editor }) => {
          const current = editor.getAttributes('textStyle').fontSize || DEFAULT_SIZE
          const idx = FONT_SIZES.indexOf(current)
          if (idx > 0) {
            return editor.chain().setFontSize(FONT_SIZES[idx - 1]).run()
          }
          return false
        },
    }
  },

})
