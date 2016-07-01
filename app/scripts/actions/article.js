export const TOGGLE_PUBLISH = 'TOGGLE_PUBLISH'

export function toggleArticlePublish(id) {
  return { type: TOGGLE_PUBLISH, id }
}
