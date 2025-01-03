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
    <div className="flex-1 overflow-auto h-[calc(100vh-5rem)] p-4">
      <div className="grid gap-4">
        {items.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <p className="text-xs text-muted-foreground mt-2">{item.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

