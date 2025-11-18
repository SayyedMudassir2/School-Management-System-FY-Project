
import { Award, BookOpen, Star, Users } from "lucide-react";

const stats = [
    {
      id: 1,
      name: 'Worldwide Students',
      value: '260K+',
      icon: Users,
    },
    {
      id: 2,
      name: 'Years Experience',
      value: '24+',
      icon: Award,
    },
    {
      id: 3,
      name: 'Professional Courses',
      value: '550+',
      icon: BookOpen,
    },
    {
      id: 4,
      name: 'Amazing Reviews',
      value: '2M+',
      icon: Star,
    },
  ]
  
  export function Stats() {
    return (
      <div className="bg-secondary/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-muted-foreground">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                    <stat.icon className="w-10 h-10 mx-auto mb-4 text-primary" />
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    )
  }
