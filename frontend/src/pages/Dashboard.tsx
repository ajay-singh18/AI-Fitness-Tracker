import { useEffect, useState } from "react"
import { getMotivationalMessage } from "../assets/assets"
import { useAppContext } from "../context/AppContext"
import type { ActivityEntry, FoodEntry } from "../types"
import Card from "../components/ui/Card"
import ProgressBar from "../components/ui/ProgressBar"
// import { , type ActivityEntry } from "../types"


const Dashboard = () => {

  const {user,allActivityLogs,allFoodLogs} = useAppContext()
  const [todayFood,setTodayFood] = useState<FoodEntry[]>([])
  const [todayActivities,setTodayActivities] = useState<ActivityEntry[]>([])
  const DAILY_CALORIE_LIMIT: number = user?.dailyCalorieIntake || 2000;
   
  // Load user data

  const loadUserData = ()=>{

    const today = new Date().toISOString().split('T')[0];
    const foodData = allFoodLogs.filter((f:FoodEntry)=> f.createdAt?.split('T')[0]===today)
    setTodayFood(foodData)
    const activityData = allActivityLogs.filter((a:ActivityEntry)=>a.createdAt?.split('T')[0]===today)
    setTodayActivities(activityData)
  }
  useEffect(()=>{
    (()=>{loadUserData()})();

  },[allActivityLogs,allFoodLogs])
  const totalCalories : number = todayFood.reduce((sum,item)=> sum + item.calories,0)
  const remainingCalories : number = DAILY_CALORIE_LIMIT - totalCalories;
  const totalActiveMinutes: number = todayActivities.reduce((sum,item)=> sum+item.duration,0)
  const totalBurned : number = todayActivities.reduce((sum,item)=>sum + (item.calories || 0),0)
  const motivation = getMotivationalMessage(totalCalories,totalActiveMinutes,DAILY_CALORIE_LIMIT)
  return (
    <div className="page-container">
      {/* Header */}
      <div className="dashboard-header">
        <p className="text-emerald-100 text-sm font-medium">Welcome back</p>
        <h1 className="text-2xl font-bold mt-1 ">{`Hi there!👋 ${user?.username} `}</h1>
        {/* Motivation card  */}
        <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl ">{motivation.emoji}</span>
            <p className="text-white font-medium">{motivation.text}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="dashboard-grid">
        {/* Calories card */}
        <Card className="shadow-lg col-span-2">
            <div></div>
            <ProgressBar value={totalCalories} max={DAILY_CALORIE_LIMIT}/>
            <div className="flex items-center  justify-between mb-4"></div>
            <div></div>
            <ProgressBar value={totalBurned} max={user?.dailyCalorieBurn || 400}/>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard