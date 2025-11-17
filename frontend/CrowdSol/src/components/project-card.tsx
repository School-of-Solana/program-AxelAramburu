"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Goal } from "lucide-react"

import { Button } from "@/components/ui/button"
// import { useToast } from "@/hooks/use-toast"
// import { useCart } from "@/lib/cart-context"
import type { Project } from "@/lib/types"

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  // const { toast } = useToast()
  // const { addToCart } = useCart()

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="group relative overflow-hidden rounded-lg border">
        <div className="aspect-square overflow-hidden bg-muted">
          <Image
            src={project.image || "/placeholder.svg?height=400&width=400"}
            alt={project.name}
            width={400}
            height={400}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold">{project.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{project.description}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-medium">{project.fundsGoal.toFixed(2)} SOL </span>
            <Button
              variant="secondary"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              // disabled={project.stock <= 0}
            >
              <Goal className="mr-1 h-4 w-4" />
              Donate
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
