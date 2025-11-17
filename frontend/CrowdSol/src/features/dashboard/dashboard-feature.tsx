import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, BookOpen, CookingPot, Droplets, LucideWallet, MessageCircleQuestion } from 'lucide-react'
import React from 'react'
import { AppHero } from '@/components/app-hero'
import Link from 'next/link'

const primary: {
  label: string
  href: string
  description: string
  icon: React.ReactNode
}[] = [
  {
    label: 'Solana Docs',
    href: 'https://solana.com/docs',
    description: 'The official documentation. Your first stop for understanding the Solana ecosystem.',
    icon: <BookOpen className="w-8 h-8 text-purple-400" />,
  },
  {
    label: 'Solana Cookbook',
    href: 'https://solana.com/developers/cookbook/',
    description: 'Practical examples and code snippets for common tasks when building on Solana.',
    icon: <CookingPot className="w-8 h-8 text-green-400" />,
  },
]

const secondary: {
  label: string
  href: string
  icon: React.ReactNode
}[] = [
  {
    label: 'Solana Faucet',
    href: 'https://faucet.solana.com/',
    icon: <Droplets className="w-5 h-5 text-green-400" />,
  },
  {
    label: 'Solana Stack Overflow',
    href: 'https://solana.stackexchange.com/',
    icon: <MessageCircleQuestion className="w-5 h-5 text-orange-400" />,
  },
  {
    label: 'Wallet UI Docs',
    href: 'https://wallet-ui.dev',
    icon: <LucideWallet className="w-5 h-5 text-blue-400" />,
  },
]

export default function DashboardFeature() {
  return (
    <div>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Welcome to CrowdSol
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  The first decentralized crowdfunding platform on Solana. Create, fund, and manage projects with ease.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="/create"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Create a Project
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  See Projects
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                alt="Image"
                className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                height="550"
                src="/solana_img.jpg?height=550&width=1000"
                width="1000"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Current Projects</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">Search Open Crowdfunding Projects</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {/* {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))} */}
            </div>
            <div className="flex justify-center">
              <Link
                href="/projects"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                See Projects
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* <AppHero title="gm" subtitle="Say hi to your new Solana app." />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {primary.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="block group">
              <Card className="h-full flex flex-col transition-all duration-200 ease-in-out group-hover:border-primary group-hover:shadow-lg group-hover:-translate-y-1">
                <CardHeader className="flex-row items-center gap-4">
                  {link.icon}
                  <div>
                    <CardTitle className="group-hover:text-primary transition-colors">{link.label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{link.description}</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>More Resources</CardTitle>
              <CardDescription>Expand your knowledge with these community and support links.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {secondary.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="flex items-center gap-4 group rounded-md p-2 -m-2 hover:bg-muted transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.icon}
                      <span className="flex-grow text-muted-foreground group-hover:text-foreground transition-colors">
                        {link.label}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div> */}
    </div>
  )
}
