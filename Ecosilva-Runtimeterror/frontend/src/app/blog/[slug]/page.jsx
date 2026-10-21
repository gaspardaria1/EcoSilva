import { notFound } from 'next/navigation'

export const generateStaticParams = () => [{ slug: 'placeholder' }]

export default function BlogPost() {
  notFound()
}
