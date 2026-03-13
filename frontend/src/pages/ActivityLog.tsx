import { useEffect, useState } from "react"
import { useAppContext } from "../context/AppContext"
import type { ActivityEntry } from "../types"


const ActivityLog = () => {
  const {allActivityLogs,setAllActivityLogs} = useAppContext()

  const [activities, setActivities] = useState<ActivityEntry[]>([])
  const [showForm,setShowForm] = useState(false)
  const [formData,setFormData] = useState({name:'',duration:0,calories: 0})
  const [error, setError] = useState('')
  const today = new Date().toISOString().split('T')[0];

  const loadActivities = () => {
     const todaysActivities = allActivityLogs.filter(
       (a: ActivityEntry) => a.createdAt?.split("T")[0] === today,
     );
     setActivities(todaysActivities);
   };

    useEffect(()=>{
      (()=>{
        loadActivities()
      })();
    },[allActivityLogs])

    const totalMinutes: number  = activities.reduce((sum,a)=>sum + a.duration,0)
    

    return (
    <div className="page-container">
      {/* Header  */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
             Activity Log
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Track your workouts
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500  dark:text-slate-400">
                Active Today
            </p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {totalMinutes} min  </p>
          </div>
        </div>
      </div>

      <div className="page-content-grid">
        {/* Quick Add Section  */}

        {/* Add form  */}

        {/* Activities List  */}



      </div>
        
    </div>
  )
}

export default ActivityLog