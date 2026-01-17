import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

test('renders the header with logo and navigation links', () => {
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );

  // Check for the logo
  const logo = screen.getByAltText(/WakiliSmart/i);
  expect(logo).toBeInTheDocument();

  // Check for navigation links
  const homeLink = screen.getByText(/Home/i);
  expect(homeLink).toBeInTheDocument();

  const aboutLink = screen.getByText(/About Us/i);
  expect(aboutLink).toBeInTheDocument();

  const practiceAreasLink = screen.getByText(/Practice Areas/i);
  expect(practiceAreasLink).toBeInTheDocument();

  const knowledgeHubLink = screen.getByText(/Knowledge Hub/i);
  expect(knowledgeHubLink).toBeInTheDocument();

  // Check for the "Book Consultation" button
  const consultationButton = screen.getByText(/Book a Consultation/i);
  expect(consultationButton).toBeInTheDocument();
});
