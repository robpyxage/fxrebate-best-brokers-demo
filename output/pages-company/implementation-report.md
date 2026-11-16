# About and Careers local preview

Routes: `/about` and `/careers`. Source: the two FXRebate Word documents, extracted to `input/pages-company/content.json`. Reuses the existing site shell, Satoshi fonts, logo variants, theme and brand green. The About page includes a cashback flow. Careers includes eight expandable professional areas, the supplied no-vacancy status and a clear notice that the application channel is not connected. The exact company claims and contact channel require client confirmation during integration. The client approved publication to the existing GitHub repository and Vercel demo.

Validation: npm build and lint succeeded; 12 tests passed including source-paragraph preservation. Browser checks covered both routes at 320, 390, 834 and 1440 px, theme toggle, expandable career areas, browser errors and horizontal overflow.
