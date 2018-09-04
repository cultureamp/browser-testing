describe('CultureAmp Design website style page 5', function() {
  it('shows the text Visuals', function() {
    browser.url('/styles');
    const text = browser.getText('[id=visuals]');
    expect(text).to.equal('Visuals');
  });
});
