Entities
#-главное
(?)-добавить или нет
?-nullable

    #User
    	name string
    	email? string (или телефон или email null)
    	phone? string
    	token

    	likedFoods #Dish[]
    	foodsInCart #Dish[]
    	bookmarkedRestaurant #Restaurant[]

    	purchases #Purchase[]

    #Purchase
    	state #PurchaseState
    	Dish #Dish
    	Date Date

    #PurchaseState
    	onTheWay
    	delivered
    	canceled


    #Restaruant
    	title string
    	desc string
    	tag #RestaurantTags
    	rating float
    	dishes #Dish[]
    	adress string
    	comments #Comment[]

    #RestaurantTags
    	healthy
    	trending
    	supreme

    #Dish
    	tag? #DishTags
    	title string
    	price float
    	rating float
    	timeToCook string
    	isPopular boolean
    	dishGroup? #DishGroups
    	dishCategory? #DishCategories
    	comments #Comment[]

    #DishCategories
    	pizza
    	asian
    	donat
    	ice


    #DishGroups
    	chickenVegetables

    #DishTags
    	healthy
    	trending
    	supreme

    #Comment (как-то привязать или к ресторану или блюду)
    	author #User
    	title string
    	message string
    	rating float

    #Blog
    	articles #Article[]

    #Article
    	title string
    	author #User
    	createDate Date
    	desc markdown(сделать как-то нормальный редактор статей, где можно юзерам создавать статьи)

