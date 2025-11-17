"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { projects } from "@/lib/datas"
import { Input } from "@/components/ui/input"

export default function ProjectPage({ params }: { params: { id: string } }) {

    const router = useRouter()
    const [formData, setFormData] = useState({
        amount: "",
    })

    const project = projects.find((p) => p.id === params.id);

    if (!project) {
        return (
        <div className="container px-4 py-12 md:px-6 md:py-24 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">Thi project no exist...</h1>
            <p className="text-muted-foreground mt-2">You can search it on the projects page</p>
            <Button className="mt-4" onClick={() => router.push("/projects")}>
            See Projects
            </Button>
        </div>
        )
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        {/* 产品图片 */}
        <div className="flex items-center justify-center overflow-hidden rounded-lg bg-muted">
          <Image
            src={project.image || "/placeholder.svg?height=600&width=600"}
            alt={project.name}
            width={600}
            height={600}
            className="aspect-square object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            {/* <p className="text-xl font-semibold mt-2">¥{project.price.toFixed(2)}</p> */}
          </div>

          <div className="prose max-w-none">
            <p>{project.description}</p>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm font-medium">Amount :</span>
                <div className="grid gap-2">
                    <Input
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    />
                </div>
          </div>

          <Button className="mt-6" size="lg" >
            <Send className="mr-2 h-4 w-4" />
            Donate to the project
          </Button>

          <div className="mt-8 border-t pt-8">
            <h2 className="text-xl font-semibold mb-4">Infos</h2>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4 border-b pb-3">
                <div className="font-medium">Actual amounts : </div>
                <div>{project.amount} SOL</div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-b pb-3">
                <div className="font-medium">Goal :</div>
                <div>{project.fundsGoal} SOL</div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-b pb-3">
                <div className="font-medium">Creator : </div>
                <div>{project.creator}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
