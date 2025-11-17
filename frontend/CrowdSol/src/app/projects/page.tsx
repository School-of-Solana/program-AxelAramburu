"use client"

import { useState } from "react"
import { Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import ProjectCard from "@/components/project-card"
import { projects } from "@/lib/datas"

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  // const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000])

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())

    // const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(project.category)

    // const matchesPrice = project.price >= priceRange[0] && project.price <= priceRange[1]

    return matchesSearch // && matchesCategory && matchesPrice
  })

  // const handleCategoryChange = (category: string) => {
  //   setSelectedCategories((prev) =>
  //     prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
  //   )
  // }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                <p className="text-muted-foreground">Search open projects</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 md:w-[300px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0">
                      <Filter className="h-4 w-4" />
                      <span className="sr-only">Go</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>Select filters for searching</SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-6 py-6">
                      {/* <div className="space-y-4">
                        <h3 className="text-sm font-medium tracking-wide text-foreground">类别</h3>
                        <div className="grid gap-2">
                          {categories.map((category) => (
                            <div key={category.id} className="flex items-center gap-2">
                              <Checkbox
                                id={`category-${category.id}`}
                                checked={selectedCategories.includes(category.id)}
                                onCheckedChange={() => handleCategoryChange(category.id)}
                              />
                              <label
                                htmlFor={`category-${category.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {category.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div> */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium tracking-wide text-foreground">Amount</h3>
                          <p className="text-sm text-muted-foreground">
                            {priceRange[0]} - {priceRange[1]} SOL
                          </p>
                        </div>
                        <Slider
                          defaultValue={[0, 1000]}
                          max={1000}
                          step={10}
                          value={priceRange}
                          onValueChange={setPriceRange}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedCategories([])
                          setPriceRange([0, 1000])
                        }}
                      >
                        Clear
                      </Button>
                      <Button>Apply</Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            {filteredProjects.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg font-medium">No results</p>
                <p className="text-muted-foreground">...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}