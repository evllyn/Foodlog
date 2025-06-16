import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Upload, Camera, Clock, Utensils, TrendingUp, Trash2 } from 'lucide-react'
import './App.css'

function App() {
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentMeal, setCurrentMeal] = useState({
    type: '',
    time: '',
    description: '',
    photo: null,
    calories: null,
    analyzing: false,
    analysisData: null
  })
  const fileInputRef = useRef(null)

  // Load meals when component mounts
  useEffect(() => {
    loadTodayMeals()
  }, [])

  const loadTodayMeals = async () => {
    try {
      setLoading(true)
      
      // Load from localStorage
      const storedMeals = localStorage.getItem('foodLogMeals')
      if (storedMeals) {
        const allMeals = JSON.parse(storedMeals)
        const today = new Date().toDateString()
        const todayMeals = allMeals.filter(meal => 
          new Date(meal.created_at).toDateString() === today
        )
        setMeals(todayMeals)
      }
    } catch (error) {
      console.error('Error loading meals:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveMealToLocalStorage = (mealData) => {
    try {
      const meal = {
        id: Date.now(),
        meal_type: mealData.type,
        meal_time: mealData.time,
        description: mealData.description,
        photo_data: mealData.photo,
        estimated_calories: mealData.calories,
        analysis_data: mealData.analysisData,
        created_at: new Date().toISOString()
      }
      
      const storedMeals = localStorage.getItem('foodLogMeals')
      const allMeals = storedMeals ? JSON.parse(storedMeals) : []
      allMeals.unshift(meal)
      
      // Keep only last 100 meals to avoid storage issues
      if (allMeals.length > 100) {
        allMeals.splice(100)
      }
      
      localStorage.setItem('foodLogMeals', JSON.stringify(allMeals))
      return meal
      
    } catch (error) {
      console.error('Error saving meal:', error)
      return null
    }
  }

  const deleteMeal = (mealId) => {
    try {
      // Remove from local state
      setMeals(prev => prev.filter(meal => meal.id !== mealId))
      
      // Remove from localStorage
      const storedMeals = localStorage.getItem('foodLogMeals')
      if (storedMeals) {
        const allMeals = JSON.parse(storedMeals)
        const updatedMeals = allMeals.filter(meal => meal.id !== mealId)
        localStorage.setItem('foodLogMeals', JSON.stringify(updatedMeals))
      }
    } catch (error) {
      console.error('Error deleting meal:', error)
    }
  }

  const estimateCaloriesFromImage = (imageData) => {
    // Simple calorie estimation based on image analysis simulation
    // In a real implementation, this would use computer vision APIs
    
    // Simulate different calorie ranges based on image characteristics
    const baseCalories = Math.floor(Math.random() * 300) + 200 // 200-500 base
    
    // Add some variation based on "image analysis"
    const variation = Math.floor(Math.random() * 200) - 100 // -100 to +100
    const estimatedCalories = Math.max(100, baseCalories + variation)
    
    return {
      total_calories: estimatedCalories,
      confidence: 0.75 + Math.random() * 0.2, // 75-95% confidence
      detected_foods: [
        {
          name: 'Prato principal',
          calories: Math.floor(estimatedCalories * 0.6),
          confidence: 0.8
        },
        {
          name: 'Acompanhamentos',
          calories: Math.floor(estimatedCalories * 0.4),
          confidence: 0.7
        }
      ]
    }
  }

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        setCurrentMeal(prev => ({
          ...prev,
          photo: e.target.result,
          analyzing: true
        }))
        
        // Simulate analysis time
        setTimeout(() => {
          const analysis = estimateCaloriesFromImage(e.target.result)
          
          setCurrentMeal(prev => ({
            ...prev,
            calories: analysis.total_calories,
            analyzing: false,
            analysisData: analysis
          }))
        }, 1500) // 1.5 second delay to simulate processing
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const event = { target: { files: [file] } }
      handlePhotoUpload(event)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (currentMeal.photo && currentMeal.type && currentMeal.time && currentMeal.description) {
      // Save to localStorage
      const savedMeal = saveMealToLocalStorage(currentMeal)
      
      if (savedMeal) {
        // Add to local state
        setMeals(prev => [savedMeal, ...prev])
        
        // Reset form
        setCurrentMeal({
          type: '',
          time: '',
          description: '',
          photo: null,
          calories: null,
          analyzing: false,
          analysisData: null
        })
        
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    }
  }

  const getTotalCalories = () => {
    return meals.reduce((total, meal) => total + (meal.estimated_calories || 0), 0)
  }

  const getCurrentTime = () => {
    const now = new Date()
    return now.toTimeString().slice(0, 5)
  }

  const formatMealType = (type) => {
    const types = {
      'breakfast': 'Café da Manhã',
      'lunch': 'Almoço',
      'dinner': 'Jantar',
      'snack': 'Lanche'
    }
    return types[type] || type
  }

  const formatTime = (timeString) => {
    if (!timeString) return ''
    const [hours, minutes] = timeString.split(':')
    return `${hours}:${minutes}`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Utensils className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Food Log</h1>
            </div>
            <nav className="flex space-x-8">
              <a href="#" className="text-gray-900 hover:text-green-600 font-medium">Home</a>
              <a href="#" className="text-gray-500 hover:text-green-600 font-medium">Histórico</a>
              <a href="#" className="text-gray-500 hover:text-green-600 font-medium">Configurações</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-5 w-5" />
                  <span>Adicionar Foto da Refeição</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {currentMeal.photo ? (
                    <div className="space-y-4">
                      <img
                        src={currentMeal.photo}
                        alt="Uploaded meal"
                        className="max-w-full h-48 object-cover rounded-lg mx-auto"
                      />
                      {currentMeal.analyzing && (
                        <div className="text-blue-600">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          Analisando calorias...
                        </div>
                      )}
                      {currentMeal.calories && !currentMeal.analyzing && (
                        <div className="text-green-600 font-semibold">
                          Estimativa: {currentMeal.calories} calorias
                          {currentMeal.analysisData && (
                            <div className="text-sm text-gray-600 mt-1">
                              Confiança: {Math.round(currentMeal.analysisData.confidence * 100)}%
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          Arraste e solte uma foto, ou clique para navegar
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, GIF até 10MB
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Meal Entry Form */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Refeição</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="meal-type">Tipo de Refeição</Label>
                      <Select value={currentMeal.type} onValueChange={(value) => setCurrentMeal(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breakfast">Café da Manhã</SelectItem>
                          <SelectItem value="lunch">Almoço</SelectItem>
                          <SelectItem value="dinner">Jantar</SelectItem>
                          <SelectItem value="snack">Lanche</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meal-time">Horário</Label>
                      <Input
                        id="meal-time"
                        type="time"
                        value={currentMeal.time}
                        onChange={(e) => setCurrentMeal(prev => ({ ...prev, time: e.target.value }))}
                        placeholder={getCurrentTime()}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva sua refeição..."
                      value={currentMeal.description}
                      onChange={(e) => setCurrentMeal(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={!currentMeal.photo || !currentMeal.type || !currentMeal.time || !currentMeal.description || currentMeal.analyzing}
                  >
                    Adicionar Refeição
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Daily Summary */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Resumo Diário</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {getTotalCalories()}
                  </div>
                  <div className="text-sm text-green-700">Total de Calorias</div>
                  <div className="mt-4 text-xs text-green-600">
                    {meals.length} refeição{meals.length !== 1 ? 'ões' : ''} registrada{meals.length !== 1 ? 's' : ''} hoje
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Entries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Refeições de Hoje</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2"></div>
                    <p className="text-gray-500 text-sm">Carregando...</p>
                  </div>
                ) : meals.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    Nenhuma refeição registrada hoje
                  </p>
                ) : (
                  <div className="space-y-3">
                    {meals.slice(0, 10).map((meal) => (
                      <div key={meal.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 group">
                        {meal.photo_data && (
                          <img
                            src={meal.photo_data}
                            alt={meal.description}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {formatMealType(meal.meal_type)}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {meal.description}
                              </p>
                            </div>
                            <div className="text-right flex items-center space-x-2">
                              <div>
                                <p className="text-xs text-gray-500">{formatTime(meal.meal_time)}</p>
                                <p className="text-xs font-medium text-green-600">
                                  {meal.estimated_calories} cal
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteMeal(meal.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Storage Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-sm text-blue-700">
                    💾 Dados salvos localmente
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Suas refeições ficam salvas neste navegador
                  </div>
                  <div className="text-xs text-blue-500 mt-2">
                    Para sincronizar entre dispositivos, use o mesmo navegador
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

