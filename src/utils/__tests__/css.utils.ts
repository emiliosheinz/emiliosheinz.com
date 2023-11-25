import { classNames } from '~/utils/css.utils'

describe('css.utils', () => {
  describe('classNames', () => {
    it('should return a string with the classes', () => {
      const classes = ['class1', 'class2']
      const result = 'class1 class2'
      expect(classNames(...classes)).toEqual(result)
    })

    it('should ignore falsy values', () => {
      const classes = ['class1', undefined, '', 'class2']
      const result = 'class1 class2'
      expect(classNames(...classes)).toEqual(result)
    })
  })
})
