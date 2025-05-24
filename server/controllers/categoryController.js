import Category from '../models/Category.js'
import slugify from 'slugify'


//get all category
export async function getAllCategory(req,res){
    try {
        const categories = await Category.find()

    res.json(categories)
    } catch (error) {
        return res.status(500).json({
            message:"error fetching categories"
        })
    }
}


//get category by id
export async function getCategoryById(req,res){
    try {
        const category = await Category.findById()

        if (!category) {
      return res.status(404).json({ message: 'category not found' });
    }

        res.json(category)
        
    } catch (error) {
         return res.status(500).json({
            message:"error fetching category"
        })
    }
}


//create category(Admin only)
export async function createCategory(req,res){
    try {
        const {name,description} = req.body

        const slug = slugify(name.trim(), { lower: true, strict: true });

    const category = new Category({
        name,
        description,
        slug
    })

    await category.save()
    res.status(201).json(category);
    } catch (error) {
        res.status(400).json({
            message:"error creating category",error:error.message
        })
    }
}


//update category(admin only)
export async function updateCategory(req,res){
    try {
        const {name,description} = req.body
        
        const category = await Category.findById(req.params.id)
        if(!category){
            res.status(400).json({message:"category not found"})
        }

        category.name = name ?? category.name
        category.description = description ?? category.description

        await category.save()
        res.json(category)
    } catch (error) {
        res.status(400).json({
            message:"error updating category",error:error.message
        })
    }
    }

//delete category
export async function deleteCategory(req,res){
    try {
        const category = await Category.findById(req.params.id)

        if(!category)return res.status(400).json({message:"category not found"})

        await category.deleteOne();
        res.status(200).json({message:"category deleted succesfully"})
        
    } catch (error) {
        res.status(400).json({
            message:"error deleting category",error:error.message
        })
    }
    }
