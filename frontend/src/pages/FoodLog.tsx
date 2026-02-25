import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext"
import { type FoodEntry, type FormData } from "../types";
import Card from "../components/ui/Card";
import { mealTypeOptions, quickActivitiesFoodLog } from "../assets/assets";
import Button from "../components/ui/Button";
import { Loader2Icon, PlusIcon, SparkleIcon } from "lucide-react";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import mockApi from "../assets/mockApi";


const FoodLog = () => {
  const { allFoodLogs, setAllFoodLogs } = useAppContext();
  const [entities, setEntities] = useState<FoodEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    calories: 0,
    mealType: ''
  })
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data } = await mockApi.foodLogs.create({ data: formData })
    setAllFoodLogs(prev => [...prev, data])
    setFormData({ name: '', calories: 0, mealType: '' })
    setShowForm(false)
  }

  const [loading, setLoading] = useState(false)
  const today = new Date().toISOString().split('T')[0];
  const loadEntries = () => {
    const todaysEntries = allFoodLogs.filter((e: FoodEntry) => e.createdAt?.split('T')[0] === today)
    setEntities(todaysEntries)
  }
  const inputRef = useRef<HTMLInputElement>(null)

  const totalCalories = entities.reduce((sum, e) => sum + e.calories, 0) //

  const handleQuickAdd = (activityName: string) => {
    setFormData({ ...formData, mealType: activityName })
    setShowForm(true)
  }

  useEffect(() => {
    (() => {
      loadEntries();
    })();
  }, [allFoodLogs])
  return (
    <div className="page-container">
      {/* Header  */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Food Log</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track your intake</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">Today's Total</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{totalCalories} kcal</p>
          </div>
        </div>
      </div>

      <div className="page-content-grid">
        {/* Quick Add Section  */}
        {!showForm && (
          <div className="space-y-4">
            <Card>
              <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">Quick Add</h3>
              <div className="flex flex-wrap gap-2">
                {quickActivitiesFoodLog.map((activity) => (
                  <button key={activity.name}
                    onClick={() => handleQuickAdd(activity.name)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors"
                  >{activity.emoji} {activity.name}
                  </button>
                ))}
              </div>
            </Card>
            <Button className="w-full" onClick={() => setShowForm(true)}>
              <PlusIcon className="size-5" />
              Add Food Entry
            </Button>

            <Button className="w-full" onClick={() => { inputRef.current?.click() }}>
              <SparkleIcon className="size-5" />
              AI Food Snap
            </Button>
            <input type="file" accept="image/*" hidden ref={inputRef} />
            {loading && (
              <div className="fixed inset-0 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blue flex items-center justify-center z-100">
                <Loader2Icon className="size-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
              </div>
            )}
          </div>
        )}

        {/* Add Form  */}
        {showForm && (
          <Card className="border-2 border-emerald-200 dark:border-emerald-800">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">New Food Entry</h3>

            <form action="" className="space-y-4" onSubmit={handleSubmit}>
              <Input label="Food Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v.toString() })} placeholder="e.g., Grilled Chicken Salad" required />

              <Input label="Calories" type="number" value={formData.calories} onChange={(v) => setFormData({ ...formData, calories: Number(v) })} placeholder="e.g., 350" required min={1} />
              <Select label="Meal Type" value={formData.mealType} onChange={(v) => setFormData({ ...formData, mealType: v.toString() })} options={mealTypeOptions} placeholder="Select meal type" required />



              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => {
                  setShowForm(false); setFormData({
                    name: '',
                    calories: 0,
                    mealType: ''
                  })
                }}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 " variant="secondary" > //
                  Add Entry
                </Button>

              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  )
}

export default FoodLog