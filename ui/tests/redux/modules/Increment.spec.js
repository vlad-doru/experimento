import reducer, { initialState } from 'redux/modules/Increment'

describe('(Redux) Increment', () => {
  describe('(Reducer)', () => {
    it('sets up initial state', () => {
      expect(reducer(undefined, {})).to.eql(initialState)
    })
  })
})
