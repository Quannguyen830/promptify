import { Card, CardContent } from "~/components/ui/card"

const items = [
  {
    title: "Project Update",
    description: "Latest updates on the ongoing project development.",
    date: "2 hours ago"
  },
  {
    title: "Team Meeting",
    description: "Discussion about the new feature implementation.",
    date: "5 hours ago"
  },
  {
    title: "Design Review",
    description: "Feedback on the latest UI/UX proposals.",
    date: "1 day ago"
  }
]

export function MainContent() {
  return (
    <div className="flex-1 overflow-auto h-[calc(100vh-7.5rem)] p-6">
      <div className="grid gap-6">
        {items.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
              <p className="text-md text-muted-foreground">{item.description}</p>
              <p className="text-sm text-muted-foreground mt-2">{item.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

