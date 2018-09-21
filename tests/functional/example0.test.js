describe('CultureAmp Design website style page 0', () => {
  it('shows the text Visuals', () => {
    return browser
      .url('/styles')
      .getText('[id=visuals]')
      .then(text => expect(text).to.equal('Visuals'));
  });
});
