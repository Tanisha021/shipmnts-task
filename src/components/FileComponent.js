'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, FolderPlus, FilePlus,FolderOpenDot } from 'lucide-react'

const FileExplorer = () => {
  const [structure, setStructure] = useState([
    { id: '1', name: 'Root', type: 'folder', children: [] }
  ])

  const [selectedItem, setSelectedItem] = useState(null)
  const [newItemName, setNewItemName] = useState('')

  const handleSelectItem = (item) => {
    setSelectedItem(item)
  }

  const handleAddItem = (type) => {
    if (!selectedItem || selectedItem.type !== 'folder') return
    const newItem = {
      id: Date.now().toString(),
      name: newItemName || `New ${type}`,
      type: type,
      children: type === 'folder' ? [] : undefined
    }
    const updatedStructure = addItemToStructure(structure, selectedItem.id, newItem)
    setStructure(updatedStructure)
    setNewItemName('')
  }

  const handleRename = () => {
    if (!selectedItem || !newItemName) return
    const updatedStruct = renameItemInStruct(structure, selectedItem.id, newItemName)
    setStructure(updatedStruct)
    setNewItemName('')
  }

  const handleDelete = () => {
    if (!selectedItem) return
    const updatedStruct = deleteItemFromStruct(structure, selectedItem.id)
    setStructure(updatedStruct)
    setSelectedItem(null)
  }

  const addItem = (items, parentId, newItem) => {
    return items.map(item => {
      if (item.id === parentId) {
        return { ...item, children: [...(item.children || []), newItem] }
      }
      if (item.children) {
        return { ...item, children: addItem(item.children, parentId, newItem) }
      }
      return item
    })
  }

  const renameItem = (items, itemId, newName) => {
    return items.map(item => {
      if (item.id === itemId) {
        return { ...item, name: newName }
      }
      if (item.children) {
        return { ...item, children: renameItem(item.children, itemId, newName) }
      }
      return item
    })
  }

  const deleteItem= (items, itemId) => {
    return items.filter(item => item.id !== itemId).map(item => {
      if (item.children) {
        return { ...item, children: deleteItem(item.children, itemId) }
      }
      return item
    })
  }

  const renderAll = (items) => {
    return (
      <ul className="pl-4">
        {items.map(item => (
          <li key={item.id} className="my-2">
            <div
              className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${selectedItem && selectedItem.id === item.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => handleSelectItem(item)}
            >
              {item.type === 'folder' ? '📁' : '📄'} {item.name}
            </div>
            {item.children && renderAll(item.children)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/3 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">File Structure</h2>
        {renderAll(structure)}
      </div>
      <div className="w-2/3 p-4">
        <h2 className="text-xl font-bold mb-4">Actions</h2>
        <div className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Enter name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="mb-2"
            />
          </div>
          <div className="space-x-2">
            <Button onClick={() => handleAddItem('folder')} disabled={!selectedItem || selectedItem.type !== 'folder'}>
              <FolderPlus className="mr-2 h-4 w-4" /> Add Folder
            </Button>
            <Button onClick={() => handleAddItem('file')} disabled={!selectedItem || selectedItem.type !== 'folder'}>
              <FilePlus className="mr-2 h-4 w-4" /> Add File
            </Button>
          </div>
          <div className="space-x-2">
            <Button onClick={handleRename} disabled={!selectedItem}>
              <Pencil className="mr-2 h-4 w-4" /> Rename
            </Button>
            <Button onClick={handleDelete} disabled={!selectedItem} variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileExplorer