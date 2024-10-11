import React from 'react';
import { render, screen } from '@testing-library/react';
import Trend from './Trend';

describe('Trend function', () => {
    test('Render the correct change rate and evolution rate', () => {
        render(<Trend changeRate={10} evolution={1.2} />);

        const trendDisplay = screen.getByTestId( 'trend-display');

        expect(trendDisplay).toHaveTextContent('Current change rate : 10 (+20%)');
    });

    test('Render the correct evolution rate when it is negative', () => {
        render(<Trend changeRate={10} evolution={0.9} />);

        const trendDisplay = screen.getByTestId( 'trend-display');

        expect(trendDisplay).toHaveTextContent('Current change rate : 10 (-10%)');
    });
});