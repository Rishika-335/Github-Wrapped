export interface GitHubUser {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}

export interface WrappedData {
  user: GitHubUser
  totalCommits: number
  totalStars: number
  totalRepos: number
  languages: { name: string; count: number; percentage: number; color: string }[]
  longestStreak: number
  currentStreak: number
  peakHour: number
  hourlyActivity: number[]
  commitDays: string[]
  topRepo: { name: string; stars: number; language: string | null } | null
  badges: string[]
  yearJoined: number
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  PHP: '#4F5D95',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Shell: '#89e051',
  Dart: '#00B4AB',
  Scala: '#c22d40',
  Haskell: '#5e5086',
  Elixir: '#6e4a7e',
  Vue: '#41b883',
}

export async function fetchWrappedData(username: string): Promise<WrappedData> {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  const [userRes, reposRes, eventsRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers }),
    fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, { headers }),
  ])

  if (!userRes.ok) {
    if (userRes.status === 404) throw new Error('User not found')
    if (userRes.status === 403) throw new Error('Rate limit hit — try again in a minute')
    throw new Error('GitHub API error')
  }

  const user: GitHubUser = await userRes.json()
  const repos = reposRes.ok ? await reposRes.json() : []
  const events = eventsRes.ok ? await eventsRes.json() : []

  // Languages from repos
  const langCounts: Record<string, number> = {}
  for (const repo of repos) {
    if (repo.language && !repo.fork) {
      langCounts[repo.language] = (langCounts[repo.language] || 0) + 1
    }
  }
  const totalLangCount = Object.values(langCounts).reduce((a, b) => a + b, 0)
  const languages = Object.entries(langCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / totalLangCount) * 100),
      color: LANG_COLORS[name] || '#888888',
    }))

  // Stars
  const totalStars = repos.reduce((acc: number, r: { stargazers_count: number }) => acc + r.stargazers_count, 0)

  // Top repo
  const nonForks = repos.filter((r: { fork: boolean }) => !r.fork)
  const topRepo = nonForks.sort((a: { stargazers_count: number }, b: { stargazers_count: number }) => b.stargazers_count - a.stargazers_count)[0] || null

  // Commit activity from events
  const pushEvents = events.filter((e: { type: string }) => e.type === 'PushEvent')
  const commitDaySet = new Set<string>()
  const hourCounts = new Array(24).fill(0)
  let totalCommits = 0

  for (const event of pushEvents) {
    const date = new Date(event.created_at)
    const dayStr = date.toISOString().split('T')[0]
    commitDaySet.add(dayStr)
    hourCounts[date.getHours()] += event.payload?.commits?.length || 1
    totalCommits += event.payload?.commits?.length || 1
  }

  // Streak calculation
  const sortedDays = Array.from(commitDaySet).sort()
  let longestStreak = 0
  let currentStreak = 0
  let streak = 1

  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i - 1])
    const curr = new Date(sortedDays[i])
    const diff = (curr.getTime() - prev.getTime()) / 86400000
    if (diff === 1) {
      streak++
      longestStreak = Math.max(longestStreak, streak)
    } else {
      streak = 1
    }
  }

  // Current streak
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  if (commitDaySet.has(today) || commitDaySet.has(yesterday)) {
    let cs = 1
    const days = Array.from(commitDaySet).sort().reverse()
    for (let i = 1; i < days.length; i++) {
      const prev = new Date(days[i - 1])
      const curr = new Date(days[i])
      const diff = (prev.getTime() - curr.getTime()) / 86400000
      if (diff === 1) cs++
      else break
    }
    currentStreak = cs
  }

  const peakHour = hourCounts.indexOf(Math.max(...hourCounts))

  // Badges
  const badges: string[] = []
  if (totalCommits > 500) badges.push('Commit Machine')
  else if (totalCommits > 100) badges.push('Active Coder')
  if (longestStreak >= 30) badges.push('Month Warrior')
  else if (longestStreak >= 7) badges.push('Week Streak')
  if (peakHour >= 22 || peakHour <= 4) badges.push('Night Owl')
  else if (peakHour >= 5 && peakHour <= 9) badges.push('Early Bird')
  if (languages.length >= 4) badges.push('Polyglot')
  if (totalStars > 100) badges.push('Star Collector')
  if (topRepo && topRepo.stars > 50) badges.push('Open Source Hero')

  return {
    user,
    totalCommits,
    totalStars,
    totalRepos: repos.filter((r: { fork: boolean }) => !r.fork).length,
    languages,
    longestStreak,
    currentStreak,
    peakHour,
    hourlyActivity: hourCounts,
    commitDays: sortedDays,
    topRepo: topRepo ? { name: topRepo.name, stars: topRepo.stargazers_count, language: topRepo.language } : null,
    badges,
    yearJoined: new Date(user.created_at).getFullYear(),
  }
}
