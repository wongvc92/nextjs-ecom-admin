This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

stacks used

- nextjs
- authjs
- shadcn ui
- react-easy-crop
- resend
- stripe
- zod
- drizzle-orm
- dnd-kit/core
- aws s3 bucket
- react hook form

Features

1. Dashboard
   - To do list / done list.
   - sales or orders chart per day can be filtered by day or status.
2. Banner

   - support CRUD of banner image.
   - image will be stored on aws s3 bucket.
   - upload banner to display on store page.
   - banner image can be resized, cropped or rotated.
   - uploaded banner image will be displayed on the table and support filter functionality.
   - can switch order sequence display of the banner directly in the table and will be reflected on the store page.

3. Categories
   - support CRUD of category name.
   - uploaded category name will be displayed on the table.
   - support filter by name and created date.
   - filtered category will be reflected on the table.
4. Products

   - support CRUD of category product.
   - resize, crop and rotate products image.
   - drap and drop image to reorder the image sequence.
   - display totals, featured, archived and out of stock product box. click on the box will also show filtered respectively on the products table.
   - support filter by name, created data, featured, archived and category. filtered products will be reflected on the products table.
   - support variation and nested variation product.

5. Orders

   - Display and filters total, cancelled, pending, to ship, shipped, completed orders.
   - each orderId page will display history info, logisctic info, order item and order status.
   - support table filter functionality.

6. Gallery

   - Uploaded image of product and banner will be grouped here.
   - can delete pending image. eg. user did not click submit button during product form submission. image will be labeled as unpublished. This will save space on aws s3 bucket.

7. Shippings

   - support CRUD of sender info.
   - using 3rd party api provider tracking.my.
   - support webhook.
   - customer will be notified via sms or whatsapp on the parcel shipment status.

8. Users
   - admin can invite new user via email.
   - new user will defaulted to USER role.
   - admin can appoint another USER to ADMIN ROLE.
   - suppport block user.

Future release

- support excel export of orders, users, products, banners and categories.
- refund order.
- chat.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
