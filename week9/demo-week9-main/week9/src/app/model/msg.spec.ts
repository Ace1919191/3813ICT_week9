import { Msg } from './msg';

describe('Msg', () => {
  it('should create an instance', () => {
    expect(new Msg('',new Date(),1)).toBeTruthy();
  });
});
