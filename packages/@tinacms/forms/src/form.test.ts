/**

Copyright 2019 Forestry.io Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import { Form, FormOptions } from './form'

describe('Form', () => {
  let DEFAULTS: FormOptions<any>

  beforeEach(() => {
    DEFAULTS = {
      id: 'example',
      label: 'Example',
      onSubmit: jest.fn(),
      fields: [],
    }
  })

  describe('new Form(...)', () => {
    describe('without initialValues', () => {
      it('is fine', () => {
        new Form(DEFAULTS)
      })
    })
  })

  describe('#change', () => {
    it('changes the values', async () => {
      const form = new Form({
        ...DEFAULTS,
        fields: [{ name: 'title', component: 'text' }],
      })

      form.change('title', 'Hello World')

      expect(form.values.title).toBe('Hello World')
    })
  })
  describe('#onSubmit', () => {
    const initialValues = { title: 'hello' }
    const reinitialValues = { title: 'world' }

    describe('after a successful submission', () => {
      it('reinitializes the form with the new values', async () => {
        const form = new Form({
          ...DEFAULTS,
          initialValues,
          fields: [{ name: 'title', component: 'text' }],
        })

        form.change('title', reinitialValues.title)
        await form.submit()

        expect(form.initialValues).toEqual(reinitialValues)
      })
    })

    describe('after a failed submission', () => {
      it('does not reinitialize the form', async () => {
        const form = new Form({
          ...DEFAULTS,
          initialValues,
          fields: [{ name: 'title', component: 'text' }],
          onSubmit: jest.fn(() => {
            throw new Error()
          }),
        })

        form.change('title', reinitialValues.title)

        try {
          await form.submit()
        } catch (e) {}

        expect(form.initialValues).toEqual(initialValues)
      })
    })
  })
  describe('#reset', () => {
    const initialValues = { title: 'hello' }
    describe('when form has been changed', () => {
      it('sets the form values to the initialValues', async () => {
        const reinitialValues = { title: 'world' }
        const form = new Form({
          ...DEFAULTS,
          initialValues,
          fields: [{ name: 'title', component: 'text' }],
        })
        form.change('title', reinitialValues.title)

        await form.reset()

        expect(form.initialValues).toEqual(initialValues)
      })
      describe('if given a `reset` option', () => {
        it('calls the user defined reset', async () => {
          const reset = jest.fn()
          const form = new Form({
            ...DEFAULTS,
            reset,
          })
          form.change('title', 'New Title')

          await form.reset()

          expect(reset).toHaveBeenCalled()
        })
        it('sets the form values to the initialValues', async () => {
          const form = new Form({
            ...DEFAULTS,
            reset: jest.fn(),
            initialValues,
          })

          form.change('title', 'A new title')

          await form.reset()

          expect(form.values).toEqual(initialValues)
        })
        it('sets does not the form values to the initialValues', async () => {
          const form = new Form({
            ...DEFAULTS,
            reset: jest.fn(() => {
              throw new Error()
            }),
          })
          form.change('title', 'Updated Value')

          try {
            await form.reset()
          } catch {}

          expect(form.values).not.toEqual(initialValues)
        })
      })
    })
  })
})
