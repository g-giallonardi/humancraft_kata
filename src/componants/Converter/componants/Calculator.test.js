import { render, fireEvent, cleanup, screen } from '@testing-library/react';
import Calculator from './Calculator';
import expect from "expect";

afterEach(cleanup);

describe('Calculator', () => {
  const changeRate = 1.2;

  beforeEach(() => {
    // eslint-disable-next-line testing-library/no-render-in-setup
        render(
            <Calculator changeRate={changeRate} />
        );
    })

  //smoke test
  it('renders without crashing', () => {
    expect(screen).not.toBeNull();
  });

  it('should calculate conversions correctly', () => {
    const DEFAULTAMOUNT = '10'

    const buttonConversion = screen.getByTestId( 'button-conversion');
    const inputAmount = screen.getByTestId('input-amount');

    fireEvent.change(inputAmount, {
      target: {
        value: DEFAULTAMOUNT,
      }
    });
    fireEvent.click(buttonConversion);

    const resultSourceAmount = screen.getByTestId('result-source-amount-convertion');
    const resultTargetAmount = screen.getByTestId('result-target-amount-convertion');
    const resultSourceCurrency = screen.getByTestId('result-source-currency');
    const resultTargetCurrency = screen.getByTestId('result-target-currency');
    const displayDirection = screen.getByTestId('display-swap-currencies');

    if (displayDirection.value === 'EUR > USD') {
      expect(resultSourceAmount).toHaveTextContent(DEFAULTAMOUNT);
      expect(resultTargetAmount).toHaveTextContent( parseInt(DEFAULTAMOUNT) * changeRate);
      expect(resultSourceCurrency).toHaveTextContent('EUR');
      expect(resultTargetCurrency).toHaveTextContent('USD');
    } else {
      expect(resultSourceAmount).toHaveTextContent(DEFAULTAMOUNT);
      expect(resultTargetAmount).toHaveTextContent(parseInt(DEFAULTAMOUNT) / changeRate);
      expect(resultSourceCurrency).toHaveTextContent('USD');
      expect(resultTargetCurrency).toHaveTextContent('EUR');
    }
  });

  it('swaps conversion direction correctly', () => {
    const swapButton = screen.getByTestId('button-swap-currencies');

    expect(screen.getByTestId('display-swap-currencies').value).toBe('EUR > USD');

    fireEvent.click(swapButton);
    expect(screen.getByTestId('display-swap-currencies').value).toBe('USD > EUR');
  });

  it('sets custom rate correctly', () => {
    const checkbox = screen.getByTestId('checkbox-force-change-rate');

    fireEvent.click(checkbox);
    expect(screen.getByTestId('input-forced-change-rate-amount').value).toBe(changeRate.toString());

    fireEvent.change(screen.getByTestId('input-forced-change-rate-amount'), { target: { value: '0.8' } });
    expect(screen.getByTestId('input-forced-change-rate-amount').value).toBe('0.8');
  });

  it('should cancel custom change rate if above 2% of deviation',()=>{
    const DEFAULTAMOUNT = '10'

    const checkbox = screen.getByTestId('checkbox-force-change-rate');
    const inputAmount = screen.getByTestId('input-amount');
    const buttonConversion = screen.getByTestId('button-conversion');

    const extremeChangeRate = changeRate*5

    fireEvent.click(checkbox);
    expect(screen.getByTestId('input-forced-change-rate-amount').value).toBe(changeRate.toString());

    fireEvent.change(screen.getByTestId('input-forced-change-rate-amount'), { target: { value: (extremeChangeRate.toString()) } });
    expect(screen.getByTestId('input-forced-change-rate-amount').value).toBe(extremeChangeRate.toString());

    fireEvent.change(inputAmount, {
      target: {
        value: DEFAULTAMOUNT,
      }
    });

    fireEvent.click(buttonConversion);

    const resultTargetAmount = screen.getByTestId('result-target-amount-convertion');
    const sysMessage = screen.getByTestId('system-message')

    expect(sysMessage).toHaveTextContent('Custom rate is above 2% deviation. Cancelling forced rate.');
    expect(resultTargetAmount).toHaveTextContent(parseInt(DEFAULTAMOUNT) * changeRate);
  })
});