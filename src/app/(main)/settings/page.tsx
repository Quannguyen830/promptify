'use client'

import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Progress } from "~/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const storageUsed = 12.44
  const storageTotal = 15
  const storagePercentage = (storageUsed / storageTotal) * 100

  return (
    <div className="container w-full space-y-8 pb-10">
      {/* Storage Section */}
      <Card>
        <CardHeader>
          <CardTitle>Storage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Progress value={storagePercentage} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {storageUsed} GB used out of {storageTotal} GB
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button>Buy Storage</Button>
            <Button variant="outline">View Storage Usage</Button>
          </div>
        </CardContent>
      </Card>

      {/* Start Page Section */}
      <Card>
        <CardHeader>
          <CardTitle>Start Page</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="home">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="home" id="home" />
              <Label htmlFor="home">Homepage</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mydrive" id="mydrive" />
              <Label htmlFor="mydrive">My Drive</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Interface Section */}
      <Card>
        <CardHeader>
          <CardTitle>Interface</CardTitle>
        </CardHeader>
        <CardContent>
          {mounted && (
            <RadioGroup defaultValue={theme} onValueChange={setTheme}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark">Dark</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system">System Default</Label>
              </div>
            </RadioGroup>
          )}
        </CardContent>
      </Card>

      {/* Density Section */}
      <Card>
        <CardHeader>
          <CardTitle>Density</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="compact">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compact" id="compact" />
              <Label htmlFor="compact">Compact</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="comfortable" id="comfortable" />
              <Label htmlFor="comfortable">Comfortable</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  )
}

